import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";
import { daldalAxios } from "@/data/axios/instance";
import axios from "axios";
import qs from "qs";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("catch POST login");

    const loginRequest = {
      ...req.body,
      secretKey: process.env.DALDAL_SECRET_KEY,
    };
    console.log(loginRequest);

    try {
      console.log("next login start");

      // const response = await daldalAxios.post("/auth/login", loginRequest);
      const response = await fetch(
        "https://daldal.k-net.kr/api/v1/auth/login",
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
        return res.status(400).json(await response.json());
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  return res.status(500).json({ error: "not found" });
}
