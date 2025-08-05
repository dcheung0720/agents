import streamlit as st
import docx2pdf
import tempfile
import base64
import os

st.title("DOCX Viewer with Full Formatting")

uploaded_file = st.file_uploader("Upload a .docx file", type="docx")

if uploaded_file:
    # Save uploaded file to a temporary DOCX
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp_docx:
        tmp_docx.write(uploaded_file.read())
        tmp_docx_path = tmp_docx.name

    # Convert DOCX to PDF
    tmp_pdf_path = tmp_docx_path.replace(".docx", ".pdf")
    docx2pdf.convert(tmp_docx_path, tmp_pdf_path)

    # Display PDF in Streamlit
    with open(tmp_pdf_path, "rb") as pdf_file:
        base64_pdf = base64.b64encode(pdf_file.read()).decode("utf-8")
        pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="100%" height="800" type="application/pdf"></iframe>'
        st.markdown(pdf_display, unsafe_allow_html=True)

    # Clean up
    os.remove(tmp_docx_path)
    os.remove(tmp_pdf_path)
