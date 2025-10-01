import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const useImageUpload = (folderName = 'images') => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ 단일 파일 업로드 (에디터에서 사용)
  const uploadFile = async file => {
    if (!file) return null;
    setLoading(true);
    try {
      const uniqueId = `${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const filePath = `${folderName}/${file.name}_${uniqueId}`;

      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      console.log('단일 파일 업로드 성공:', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('단일 파일 업로드 실패:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ 여러 파일 업로드 (썸네일 등에서 사용)
  const handleFiles = async files => {
    if (files.length === 0) return;

    setLoading(true);

    const tempImageUrls = [];
    const tempFiles = [];

    for (const file of files) {
      if (
        !['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(
          file.type,
        )
      ) {
        alert('JPG, PNG, WEBP 파일만 업로드 가능합니다.');
        setLoading(false);
        return;
      }
      tempImageUrls.push(URL.createObjectURL(file));
      tempFiles.push(file);
    }

    setUploadedImages(prev => [...prev, ...tempImageUrls]);
    setUploadedFiles(prev => [...prev, ...tempFiles]);

    const uploadPromises = files.map(async (file, index) => {
      try {
        const uniqueId = `${Date.now()}_${index}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const filePath = `${folderName}/${file.name}_${uniqueId}`;

        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Firebase 업로드 실패:', error);
        throw error;
      }
    });

    try {
      const firebaseUrls = await Promise.all(uploadPromises);
      setUploadedImageUrls(prev => [...prev, ...firebaseUrls]);
    } catch (error) {
      console.error('업로드 에러:', error);
      alert('이미지 업로드에 실패했습니다: ' + error.message);
      setUploadedImages(prev => prev.slice(0, -tempImageUrls.length));
      setUploadedFiles(prev => prev.slice(0, -tempFiles.length));
    }

    setLoading(false);
  };

  const handleFileInput = e => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleRemoveImage = index => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const resetUpload = () => {
    setUploadedImages([]);
    setUploadedFiles([]);
    setUploadedImageUrls([]);
    setLoading(false);
  };

  return {
    uploadedImages,
    uploadedImageUrls,
    uploadedFiles,
    loading,
    handleFileInput,
    resetUpload,
    handleRemoveImage,
    uploadFile, // ✅ 에디터에서 바로 쓸 수 있음
  };
};
