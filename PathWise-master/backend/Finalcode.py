import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import LanceDB
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
import lancedb
from typing import Dict, TypedDict
from langchain_core.messages import BaseMessage
import json
import operator
from typing import Annotated, Sequence, TypedDict
from langchain import hub
from langchain.output_parsers.openai_tools import PydanticToolsParser
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import BaseMessage, FunctionMessage
from langchain_core.output_parsers import StrOutputParser
# from langchain_core.pydantic_v1 import BaseModel, Field
from pydantic import BaseModel, Field
from langchain_core.runnables import RunnablePassthrough
from langchain_core.utils.function_calling import convert_to_openai_tool
import pprint
from langgraph.graph import END, StateGraph
import matplotlib.pyplot as plt
import networkx as nx


os.environ["USER_AGENT"] = "Luddy-Hackathon/1.0"
os.environ["TAVILY_API_KEY"] = "Your_Tavily_API_Key"
os.environ["OPENAI_API_KEY"] = "Your_OpenAI_API_Key"


# ----------------------------
# Step 1: Load and Chunk Documents from URLs
# ----------------------------
urls = [
    "https://bulletins.iu.edu/iub/sice/2020-2021/graduate/degree-programs/computer-science/master-of-science.shtml",
    "https://bulletins.iu.edu/iub/sice/2020-2021/graduate/courses/computer-science.shtml",
    "https://bulletins.iu.edu/iub/sice/2020-2021/graduate/degree-programs/master-of-data-science/index.shtml",
    "https://bulletins.iu.edu/iub/sice/2020-2021/graduate/courses/data%20science.shtml",
    "https://bulletins.iu.edu/iub/sice/2020-2021/graduate/courses/engineering.shtml",
    "https://bulletins.iu.edu/iub/sice/2020-2021/graduate/courses/informatics.shtml",
    "https://bulletins.iu.edu/iub/sice/2020-2021/graduate/courses/information%20and%20library%20science.shtml",
]

from langchain_community.document_loaders import WebBaseLoader
docs = [WebBaseLoader(url).load() for url in urls]
docs_list = [item for sublist in docs for item in sublist]

from langchain.text_splitter import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=250,
    chunk_overlap=0
)
doc_splits = text_splitter.split_documents(docs_list)

# ----------------------------
# Step 2: Set up LanceDB Vector Store with Embeddings
# ----------------------------
import lancedb
from langchain_openai import OpenAIEmbeddings
def lanceDBConnection(embed):
    db = lancedb.connect("/tmp/lancedb")
    table = db.create_table(
        "crag_demo",
        data=[{"vector": embed.embed_query("Hello World"), "text": "Hello World"}],
        mode="overwrite",
    )
    return db

embedder = OpenAIEmbeddings(openai_api_key=os.environ.get("OPENAI_API_KEY"))
table = lanceDBConnection(embedder)

from langchain_community.vectorstores import LanceDB
vectorstore = LanceDB.from_documents(
    documents=doc_splits,
    embedding=embedder,
    connection=table,
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# ----------------------------
# Step 3: Define Workflow Nodes
# ----------------------------

class GraphState(TypedDict):
    keys: Dict[str, any]

def build_query(state):
    keys = state["keys"]
    student_id = keys.get("student_id", "Unknown ID")
    enrollment = keys.get("enrollment", "fulltime")
    career_goal = keys.get("career_goal", "")
    time_slot = keys.get("time_slot", "")
    preferred_domain = keys.get("preferred_domain", "")
    query = (
        f"Student ID: {student_id}. Enrollment: {enrollment}. "
        f"Career goal: {career_goal}. Time slot: {time_slot}. Preferred domain: {preferred_domain}. "
        f"Based on the provided course bulletins, recommend a list of courses that best match "
        f"both the career goal and the preferred domain. For each recommended course, list the course title, "
        f"prerequisites (if any), and number of credits."
    )
    return {"keys": {**keys, "question": query}}

def retrieve(state):
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = retriever.get_relevant_documents(question)
    return {"keys": {**state_dict, "documents": documents, "question": question}}

def grade_documents(state):
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = state_dict["documents"]

    class grade(BaseModel):
        binary_score: str = Field(description="Relevance score 'yes' or 'no'")

    from langchain_openai import ChatOpenAI
    model = ChatOpenAI(temperature=0, model="gpt-4o-mini", streaming=True,
                         openai_api_key=os.environ.get("OPENAI_API_KEY"))
    grade_tool_oai = convert_to_openai_tool(grade)
    llm_with_tool = model.bind(
        tools=[convert_to_openai_tool(grade_tool_oai)],
        tool_choice={"type": "function", "function": {"name": "grade"}},
    )
    parser_tool = PydanticToolsParser(tools=[grade])
    prompt = PromptTemplate(
        template="""You are a grader. Assess whether the following document contains course details (including prerequisites or credit information) relevant to the query.
        
Query:
{question}
        
Document:
{context}
        
Answer 'yes' if relevant, otherwise 'no'.""",
        input_variables=["context", "question"],
    )
    chain = prompt | llm_with_tool | parser_tool

    filtered_docs = []
    search_flag = "No"
    for d in documents:
        score = chain.invoke({"question": question, "context": d.page_content})
        grade_result = score[0].binary_score.strip().lower()
        if grade_result == "yes":
            filtered_docs.append(d)
        else:
            search_flag = "Yes"
    return {"keys": {**state_dict, "documents": filtered_docs, "run_web_search": search_flag}}

def transform_query(state):
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = state_dict["documents"]
    prompt = PromptTemplate(
        template="""Rephrase the following query to improve retrieval of courses that combine both the career goal and preferred domain:
        
Original query:
{question}
        
Rephrased query:""",
        input_variables=["question"],
    )
    from langchain_openai import ChatOpenAI
    model = ChatOpenAI(temperature=0, model="gpt-4-0125-preview", streaming=True,
                         openai_api_key=os.environ.get("OPENAI_API_KEY"))
    chain = prompt | model | StrOutputParser()
    better_question = chain.invoke({"question": question})
    return {"keys": {**state_dict, "documents": documents, "question": better_question}}

def web_search(state):
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = state_dict["documents"]
    tool = TavilySearchResults()
    docs = tool.invoke({"query": question})
    web_results = "\n".join([d["content"] for d in docs])
    web_results_doc = Document(page_content=web_results)
    documents.append(web_results_doc)
    return {"keys": {**state_dict, "documents": documents}}

def generate(state):
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = state_dict["documents"]
    custom_prompt = PromptTemplate(
        template="""You are an AI course selector. Based on the following extracted content from university bulletins:
        
{context}
        
And the query:
{question}
        
Recommend a list of courses that combine knowledge areas relevant to both the student's career goal and preferred domain.
For example, if the career goal is "Machine Learning Engineer" and the preferred domain is "Software Engineering", include courses from machine learning and software engineering.
For each recommended course, list:
 - Course title
 - Prerequisites (if any)
 - Number of credits
        
Present your answer as a numbered list with clear details.""",
        input_variables=["context", "question"],
    )
    from langchain_openai import ChatOpenAI
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0, streaming=True,
                     openai_api_key=os.environ.get("OPENAI_API_KEY"))
    rag_chain = custom_prompt | llm | StrOutputParser()
    combined_context = "\n\n".join([d.page_content for d in documents])
    generation = rag_chain.invoke({"context": combined_context, "question": question})
    return {"keys": {**state_dict, "generation": generation}}

def career_guidance(state):
    state_dict = state["keys"]
    recommended = state_dict.get("generation", "No course recommendations generated.")
    career_goal = state_dict.get("career_goal", "Career goal not provided")
    preferred_domain = state_dict.get("preferred_domain", "Preferred domain not provided")
    prompt = PromptTemplate(
        template="""You are an expert career advisor.
Based on the following course recommendations:
{recommended}

and the student's career goal: {career_goal} and preferred domain: {preferred_domain},
provide a brief career guidance recommendation. Explain how these courses support the student's career goal and suggest strategic next steps.

Career Guidance:""",
        input_variables=["recommended", "career_goal", "preferred_domain"],
    )
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0, streaming=True,
                     openai_api_key=os.environ.get("OPENAI_API_KEY"))
    chain = prompt | llm | StrOutputParser()
    guidance = chain.invoke({
        "recommended": recommended,
        "career_goal": career_goal,
        "preferred_domain": preferred_domain
    })
    return {"keys": {**state_dict, "guidance": guidance}}

def decide_to_generate(state):
    state_dict = state["keys"]
    search = state_dict.get("run_web_search", "No")
    if search == "Yes":
        return "transform_query"
    else:
        return "generate"

# ----------------------------
# Step 4: Build the Workflow Graph
# ----------------------------
workflow = StateGraph(GraphState)
workflow.add_node("build_query", build_query)
workflow.add_node("retrieve", retrieve)
workflow.add_node("grade_documents", grade_documents)
workflow.add_node("transform_query", transform_query)
workflow.add_node("web_search", web_search)
workflow.add_node("generate", generate)
workflow.add_node("career_guidance", career_guidance)

workflow.set_entry_point("build_query")
workflow.add_edge("build_query", "retrieve")
workflow.add_edge("retrieve", "grade_documents")
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {
        "transform_query": "transform_query",
        "generate": "generate",
    },
)
workflow.add_edge("transform_query", "web_search")
workflow.add_edge("web_search", "generate")
workflow.add_edge("generate", "career_guidance")
workflow.add_edge("career_guidance", END)

app = workflow.compile()

# ----------------------------
# Step 5: Process Input & Return Output as JSON
# ----------------------------
def process_request(request_json):
    """
    Accepts input in JSON format (a dict) with the following structure:
    {
      "keys": {
        "student_id": "123456",
        "enrollment": "1",
        "career_goal": "Data Scientist",
        "time_slot": "2:30 PM",
        "preferred_domain": "Machine Learning"
      }
    }
    Processes the request and returns a dict with the model's output.
    """
    student_input = request_json  # Input is already a dict.
    final_state = None
    for output in app.stream(student_input):
        final_state = output  # Get the latest state from the workflow

    final_keys = final_state["career_guidance"]["keys"]
    response = {
        "course_recommendations": final_keys.get("generation", "No course recommendations generated."),
        "career_guidance": final_keys.get("guidance", "No guidance generated.")
    }
    return response

# For testing purposes: run only when executed as a standalone script.
# if __name__ == '__main__':
#     sample_input = {
#         "keys": {
#             "student_id": "123456",
#             "enrollment": "1",
#             "career_goal": "Data Scientist",
#             "time_slot": "2:30 PM",
#             "preferred_domain": "Machine Learning"
#         }
#     }
#     result = process_request(sample_input)
#     print(json.dumps(result, indent=2))




