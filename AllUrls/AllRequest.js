export const PostRequest = async (baseurl, bodyContent) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${baseurl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyContent),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // const result = await response.json();
      return response;
    } catch (error) {
      console.error("Error in PostRequest:", error);
      throw error; 
    }
  };
  