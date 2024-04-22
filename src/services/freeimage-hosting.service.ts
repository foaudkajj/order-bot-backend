import {HttpStatus, Injectable, Scope} from '@nestjs/common';

/**
 * @class FreeImageHostingService provides methods for uploading images to the free image hosting website (https://freeimage.host/page/api)
 */
@Injectable({scope: Scope.DEFAULT})
export class FreeImageHostingService {
  async upload(image: Buffer) {
    try {
      const form = new FormData();
      form.append('source', image.toString('base64'));

      const result = await fetch(
        'https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5',
        {
          method: 'POST',
          body: form,
        },
      );
      const resBody = (await result.json()) as FreeImageHostingResult;
      if (resBody.status_code === HttpStatus.OK) {
        return {
          success: true,
          image: {...resBody.image.image},
          thumb: {...resBody.image.thumb},
        };
      } else {
        console.error(resBody);
        return {
          success: false,
        };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
      };
    }
  }
}

interface FreeImageHostingResult {
  status_code: HttpStatus;
  success: Success;
  image: Image2;
  status_txt: string;
}
interface Image2 {
  name: string;
  extension: string;
  width: number;
  height: number;
  size: number;
  time: number;
  expiration: number;
  likes: number;
  description?: any;
  original_filename: string;
  is_animated: number;
  nsfw: number;
  id_encoded: string;
  size_formatted: string;
  filename: string;
  url: string;
  url_short: string;
  url_seo: string;
  url_viewer: string;
  url_viewer_preview: string;
  url_viewer_thumb: string;
  image: Image;
  thumb: Thumb;
  display_url: string;
  display_width: number;
  display_height: number;
  views_label: string;
  likes_label: string;
  how_long_ago: string;
  date_fixed_peer: string;
  title: string;
  title_truncated: string;
  title_truncated_html: string;
  is_use_loader: boolean;
}
interface Thumb {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}
interface Image {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
  size: number;
}
interface Success {
  message: string;
  code: number;
}
