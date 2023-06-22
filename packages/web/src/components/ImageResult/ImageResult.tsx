import React, { useEffect } from 'react';

interface Props {
  className?: string;
  id: string;
}

const ImageResult: React.FC<Props> = ({ id }) => {
  const [task, setTask] = React.useState<any>();

  const fetchTask = async () => {
    const rs = await fetch(`${import.meta.env.VITE_APP_API_URL}/getTaskById?id=${id}`);
    const data = await rs.json();

    setTask(data);
  }

  useEffect(() => {
    console.log('id', id);
    fetchTask();
  }, []);

  return (
    <div>
      {id}
      {JSON.stringify(task)}
    </div>
  );
}

export default ImageResult;