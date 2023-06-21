import "./App.css";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

const props: UploadProps = {
  name: "file",
  action: async () => {
    const data = await fetch(import.meta.env.VITE_APP_API_URL, {
      method: "POST",
    });

    const response = await data.json();

    return response.preSigned;
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

    const blodData = new Blob([file], {
      type: (file as File).type,
    });

    try {
      onProgress && onProgress({ percent: 40 });

      const response = await fetch(action, {
        method: "PUT",
        body: blodData,
      });

      onProgress && onProgress({ percent: 100 });
      onSuccess && onSuccess(response);
    } catch (err) {
      onError && onError(err as any);
    }
  },
};

function App() {
  return (
    <div className="App">
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </div>
  );
}

export default App;
