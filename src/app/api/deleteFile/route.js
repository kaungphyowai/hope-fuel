// accept array in the body of HTML
//return the it is ok

import fs from 'fs';
import { join } from 'path';

export async function DELETE(request) {
  const files = await request.json();
  console.log(files);
  for (let file in files) {
    const deleteImage = join(process.cwd(), 'public', files[file]);
    console.log(deleteImage);
    fs.unlink(deleteImage, (error) => console.log(error));
  }

  return Response.json(200);
}
