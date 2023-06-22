import React from "react";
import { useParams } from "react-router-dom";
// import spin
import { Spin } from "antd";

interface Props {
  className?: string;
}

const getThumbnailById = async (id: string) => {
  const data = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/getThumbnailById?id=${id}`,
    {
      method: "GET",
    }
  );

  const response = await data.json();
  return response;
};

const Task: React.FC<Props> = () => {
  const params = useParams();

  // state is loading
  const [loading, setLoading] = React.useState(false);
  // state error
  const [error, setError] = React.useState<string>();
  const [task, setTask] = React.useState<{
    thumbnail: string | null;
    status: string;
  }>();

  const fetchThumbnail = async () => {
    if (!params.id) return;

    setLoading(true);
    try {
      const url = await getThumbnailById(params.id);
      if (url) {
        setTask(url);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchThumbnail();
  }, [params?.id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (task?.status !== "successful") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Still in process!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={task.thumbnail || ''} alt="thumbnail" />
    </div>
  );
};

export default Task;
