const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

exports.s3Uploadv3 = async (files) => {
  const s3client = new S3Client();

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME, // 업로드하려는 버킷 이름 작성
      Key: `media/${uuid()}-${file.originalname}`, // media 폴더 아래에 커스텀한 이름으로 업로드
      Body: file.buffer, // 실제 파일이 있는 위치, 클라이언트한테 받은 파일을 현재 머신의 메모리에 저장한 후 버퍼로 저장한 다음 AWS 에 제공한다.
    };
  })

  return await Promise.all(
      params.map((param) => s3client.send(new PutObjectCommand(param)))
  );
}