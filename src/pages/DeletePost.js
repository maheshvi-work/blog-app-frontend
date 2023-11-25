import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";

export default function DeletePost() {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);

  const handleDelete = async () => {
    const response = await fetch(`https://my-blog-app-mvi.onrender.com/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="delete-div">
  
      <button className="delete-btn" onClick={handleDelete}>Confirm Delete Post</button>
    </div>
  );
}
