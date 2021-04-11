import React, { useState, useRef } from "react";
import styled from "styled-components";
import settings from "../config";
const axios = require("axios").default;

const UploadMediaStyles = styled.div`
  .upload-container {
    display: flex;
    border: 1px solid #87cac4;
    border-radius: 22px 0px;
    margin-top: 5%;
  }

  .leftside {
    width: 20%;
    background-color: #6aa552;
    border-radius: 22px 0 0px 0;
    display: flex;
    justify-content: center;
    align-items: center;

    h3 {
      writing-mode: vertical-rl;
      color: #1e29c3;
    }
  }

  .rightside {
    width: 80%;
    padding: 20px;
  }
`;

const UploadMedia = () => {
  const [media, setMedia] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0);

  const fileRef = useRef();

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "media":
        if (value != "0") {
          setMedia(value);
        }
        break;
      case "description":
        setDescription(value);
        break;
      case "fileType":
        if (value != "0") {
          setFileType(value);
        }
        break;
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];

    const extention = ["jpg", "jpeg", "png", "gif", "mp4"];
    //check for the type of image we are uploading
    if (media === "image") {
      //check extension
      const position = file.name.lastIndexOf(".");
      const fileExt = file.name.substr(position + 1, file.name.length);
      const index = extention.indexOf(fileExt);
      if (index == -1) {
        window.alert(`please you can only select an image.`);
        return;
      }
    }

    if (media === "pdf") {
      //check extension
      const position = file.name.lastIndexOf(".");
      const fileExt = file.name.substr(position + 1, file.name.length);
      if (fileExt != "pdf") {
        window.alert(`please select only a pdf file`);
        return;
      }
    }
    //save the file here
    setFile(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //check if we have a file stored in state
    if (!file) {
      window.alert("please select a file to upload");
      return;
    }
    if (!description) {
      window.alert("file description is required");
      return;
    }

    if (!fileType) {
      window.alert("file type is required.Please select the file type");
      return;
    }
    const formData = new FormData();
    formData.append("description", description);
    formData.append("digitalAssets", file);
    formData.append("assetType", fileType);
    setSubmitted(true);

    await axios.request({
      method: "post",
      url: `${settings.API_URL}/api/uploadFile`,
      data: formData,
      onUploadProgress: (ProgressEvent) => {
        setProgressStatus(
          parseFloat(
            (ProgressEvent.loaded / ProgressEvent.total) * 100
          ).toFixed(2)
        );
      },
    });
    setProgressStatus(100);
    setSubmitted(false);
    setMedia("0");
    setDescription("");
    setFileType("0");
    fileRef.current.value = "";
    setFile(null);
  };
  return (
    <UploadMediaStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="media-div">
            <div className="upload-container">
              <div className="leftside">
                <h3>Upload Media Files</h3>
              </div>
              <div className="rightside">
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label>Media Type</label>
                    <select
                      className="form-control"
                      name="media"
                      onChange={handleChange}
                      value={media}
                    >
                      <option value="0">select media type</option>
                      <option value="pdf">documents (pdf)</option>
                      <option value="image">image</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Media Type</label>
                    <select
                      className="form-control"
                      name="fileType"
                      onChange={handleChange}
                      value={fileType}
                    >
                      <option value="0">select file type</option>
                      <option value="course materials">course materials</option>
                      <option value="past questions">past questions</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      aria-label="With textarea"
                      value={description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-control">Select file</label>
                    <input
                      type="file"
                      className="file"
                      onChange={onFileChange}
                      id="fileInput"
                      ref={fileRef}
                    />
                  </div>

                  {submitted && (
                    <div className="progress mb-3">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: progressStatus + "%" }}
                        aria-valuenow={progressStatus}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={submitted}
                      className="btn btn-success"
                    >
                      submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UploadMediaStyles>
  );
};

export default UploadMedia;
