import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload, Spin } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  // state loading
  const [loading, setLoading] = useState(false);
  const [uploadID, setUploadID] = useState<string>();

  const props: UploadProps = {
    name: "file",
    action: async (file) => {
      setLoading(true);
      try {
        const data = await fetch(
          `${import.meta.env.VITE_APP_API_URL}?contentType=${file.type}`,
          {
            method: "POST",
          }
        );

        const response = await data.json();
        setUploadID(response.id);
        return response.preSigned;
      } catch (err) {
        console.log(err);
        message.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    method: "PUT",
    multiple: false,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest: async (options) => {
      const { onSuccess, onError, file, onProgress, action } = options;

      try {
        onProgress && onProgress({ percent: 40 });

        const response = await fetch(action, {
          method: "PUT",
          body: file,
        });

        onProgress && onProgress({ percent: 100 });
        onSuccess && onSuccess(response);
      } catch (err) {
        onError && onError(err as any);
      }
    },
  };

  return (
    <div className="App p-2">
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>

      <Spin spinning={loading} />

      {uploadID && (
        // link to /task/:id
        <Link to={`/task/${uploadID}`}>Go To Result</Link>
      )}
    </div>
  );
}

export default Home;
