import React, { useCallback } from "react";

import { getApi } from "../services/axios.service";

const GoogleLogin = () => {

  const handleClick = useCallback(async () => {
    const response = await getApi("/users/google");
    window.location.href = response.url;
  }, []);
  return (
    <div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
};

export default GoogleLogin;
