import { NextApiRequest, NextApiResponse } from "next";

export default async function reissue(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("catch POST reissue");

  if (req.method === "POST") {
    const loginRequest = {
      ...req.body,
      secretKey: process.env.DALDAL_SECRET_KEY,
    };

    try {
      console.log("next login start");

      const response = await fetch(
        "https://daldal.k-net.kr/api/v1/auth/reissue",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginRequest),
        }
      );

      if (response.status === 200) {
        return res.status(200).json(await response.json());
      } else {
        console.log(response);
        return res.status(400).json(await response.json());
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  return res.status(500).json("not found");
}
