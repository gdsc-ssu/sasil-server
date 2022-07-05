/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import dotenv from 'dotenv';
import { ServerError } from '@/errors/customErrors';

dotenv.config();

interface ResponseType {
  success: boolean;
  errors: any[];
  messages: any[];
  result: {
    id: string;
    uploadURL: string;
  };
  result_info: string | null;
}

// Direct Creator Upload 방식
export const getImgUploadURL = async () => {
  try {
    const imageResponse = await axios.post<ResponseType>(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
      null,
      {
        headers: {
          Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
        },
      },
    );

    return { imgUploadURL: imageResponse.data.result.uploadURL };
  } catch (error) {
    throw new ServerError('이미지 업로드 URL을 받아오는데 실패하였습니다.');
  }
};
