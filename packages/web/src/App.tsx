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
