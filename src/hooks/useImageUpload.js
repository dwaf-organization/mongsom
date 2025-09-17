import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const useImageUpload = (folderName = 'images') => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = async files => {
    if (files.length === 0) return;

    setLoading(true);

    const tempImageUrls = [];
    const tempFiles = [];
    const tempFirebaseUrls = [];

    // 파일 유효성 검사
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

    // 기존 이미지에 새로운 이미지 추가
    setUploadedImages(prev => [...prev, ...tempImageUrls]);
    setUploadedFiles(prev => [...prev, ...tempFiles]);

    // Firebase 업로드 (병렬 처리)
    console.log('Firebase 업로드 시작...', files.length, '개 파일');
    const uploadPromises = files.map(async (file, index) => {
      try {
        const uniqueId = `${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;
        const filePath = `${folderName}/${file.name}_${uniqueId}`;

        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        console.log('업로드 성공:', downloadUrl);
        return downloadUrl;
      } catch (error) {
        console.error('Firebase 업로드 실패:', error);
        throw error;
      }
    });

    try {
      const firebaseUrls = await Promise.all(uploadPromises);
      console.log('모든 업로드 완료:', firebaseUrls);
      setUploadedImageUrls(prev => [...prev, ...firebaseUrls]);
    } catch (error) {
      console.error('업로드 에러:', error);
      alert('이미지 업로드에 실패했습니다: ' + error.message);
      // 실패한 경우 새로 추가한 이미지들만 제거
      setUploadedImages(prev => prev.slice(0, -tempImageUrls.length));
      setUploadedFiles(prev => prev.slice(0, -tempFiles.length));
    }

    setLoading(false);
  };

  const handleFileInput = e => {
    const files = Array.from(e.target.files);
    console.log('선택된 파일들:', files);
    console.log('files.length:', files.length);
    if (files.length > 0) {
      handleFiles(files);
    } else {
      console.log('파일이 선택되지 않았습니다.');
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
  };
};
