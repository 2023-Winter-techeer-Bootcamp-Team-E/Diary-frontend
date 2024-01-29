import React, { useState, useEffect } from 'react';
import { baseInstance } from '../api/config.js';
import styled from 'styled-components';
import Sun from '../assets/img/Sun.png';
import upbutton from '../assets/img/upbutton.png';
import downbutton from '../assets/img/downbutton.png';
import preBtn from '../assets/img/Calendar/preBtn.png';
import SelectImgBtn from '../assets/img/SelectImgBtn.png';

function BasicSticker({ onStickerSelect, websocket }) {
  const [stickerPageNum, setStickerPageNum] = useState(1);
  const [stickerImages, setStickerImages] = useState([]);

  const handleStickerClick = (image) => {
    onStickerSelect(image);
    websocket.current.send(
      JSON.stringify({
        type: 'create_sticker',
        image: image,
        position: {
          top2: 100,
          left2: 100,
          width2: 100,
          height2: 100,
          rotate2: 0,
        },
      }),
    );
  };

  useEffect(() => {
    // API 호출 함수
    const fetchStickerImages = async () => {
      try {
        // API 호출 및 데이터 수신
        const response = await baseInstance.get(
          `/static/stickers?page=${stickerPageNum}`,
        );
        const data = response.data.data;

        // 이미지 URL을 상태에 업데이트
        setStickerImages(data.st_image_urls);
      } catch (error) {
        console.error('Error fetching sticker images:', error);
      }
    };

    // 페이지 번호가 변경될 때마다 API 호출
    fetchStickerImages();
  }, [stickerPageNum]); // stickerPageNum이 변경될 때마다 useEffect가 실행

  const handleUpButtonClick = () => {
    if (stickerPageNum > 1) {
      setStickerPageNum((prevPageNum) => prevPageNum - 1);
    }
  };

  const handleDownButtonClick = () => {
    if (stickerPageNum < 7) {
      setStickerPageNum((prevPageNum) => prevPageNum + 1);
    }
  };

  const [upButtonHovered, setUpButtonHovered] = useState(false);
  const [downButtonHovered, setDownButtonHovered] = useState(false);

  return (
    <BasicStickerContainer>
      {stickerImages.map((image, index) => (
        <StaticStickerBox key={index} onClick={() => handleStickerClick(image)}>
          <StaticSticker src={image} alt={`Sticker ${index + 1}`} />
        </StaticStickerBox>
      ))}

      <StyledSun src={Sun} alt="Sun" />
      <StyledUpButton
        onClick={handleUpButtonClick}
        onMouseEnter={() => setUpButtonHovered(true)}
        onMouseLeave={() => setUpButtonHovered(false)}
        src={upButtonHovered ? SelectImgBtn : preBtn}
        alt={upButtonHovered ? 'SelectImgBtn' : 'preBtn'}
      />
      <StyledDownButton
        onClick={handleDownButtonClick}
        onMouseEnter={() => setDownButtonHovered(true)}
        onMouseLeave={() => setDownButtonHovered(false)}
        src={downButtonHovered ? SelectImgBtn : preBtn}
        alt={downButtonHovered ? 'SelectImgBtn' : 'preBtn'}
      />
      <ScrollContainer />
    </BasicStickerContainer>
  );
}

const BasicStickerContainer = styled.div`
  width: 15.45rem;
  height: 42.0625rem;
  border-radius: 1.875rem;
  background: #e7eef9;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-items: stretch;
  justify-content: center;
  position: relative;
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

const StyledSun = styled.img`
  position: absolute;
  z-index: 10;
  width: 10.25rem;
  height: 7.0625rem;
  top: -1.9375rem;
  left: -2.6875rem;
`;

const StyledUpButton = styled.img`
  width: 1.63rem;
  height: 1.59675rem;
  z-index: 10;
  position: absolute;
  bottom: -3.356rem;
  left: 5.25rem;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;

const StyledDownButton = styled.img`
  width: 1.63rem;
  height: 1.59675rem;
  z-index: 10;
  position: absolute;
  bottom: -3.356rem;
  left: 8.25rem;
  cursor: pointer;
  transform: rotate(180deg);
  &:hover {
    transform: scale(1.2) rotate(180deg);
  }
`;


const ScrollContainer = styled.div`
  width: 13.25rem;
  height: 3.0625rem;
  border-radius: 1.875rem;
  background: #e7eef9;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  position: absolute;
  bottom: -4.15rem;
  left: 1.1rem;
`;

const StaticStickerBox = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  width: 7.625rem;
  height: 100%;
  z-index: 10;
`;

const StaticSticker = styled.img`
  position: absolute;
  width: 6.5rem;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.15);
  }
`;

export default BasicSticker;
