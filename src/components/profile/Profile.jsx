'use client';
import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LikegridComponent from '../bucket/Likegrid';
import ProductsComponent from './ProductsComponent';
import { RefreshAccessToken } from '@compoents/util/http';

import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";

export default function UserProfile({ userInfo, followerList, followingList, userproducts, accessToken }) {
  const [currentView, setCurrentView] = useState('products');
  const router = useRouter();

  useEffect(() => {
    if (userInfo.state === 'Jwt Expired') {
      const refreshAccessToken = async () => {
        try {
          const newAccessToken = await RefreshAccessToken();
        } catch (error) {
          console.error('accessToken 재발급 실패', error);
        }
      };
      refreshAccessToken();
    } else {
    }
  }, [userInfo]);

  const defaultImage = "/images/kakaoImg.jpg";

  function handleEditProfileClick() {
    router.push('/myedit');
  }
  const showProducts = () => {
    setCurrentView('products');
  };

  const showLikes = () => {
    setCurrentView('likes');
  };


  return (

    <div className={styles.profileContainer}>

      <>
        <div className={styles.profileInfo}>
          <div>
            <Image
              src={userInfo.image || defaultImage}
              alt="이미지"
              width={200}
              height={200}
              className={styles.profileImg}
              priority
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.profileNickName}>
              {userInfo.nick_name}
            </div>
          </div>
          <div className={styles.Followes}>
            <div>
              <Popover showArrow={true} placement="bottom">
                <PopoverTrigger className={styles.followButton}>
                  <Button className={styles.Followingbtn}>팔로잉 {userInfo.following}</Button>
                </PopoverTrigger>

                <PopoverContent className={styles.modal}>
                  <ul>
                    {followingList.map((following) => (
                      <li key={following.member_id}>
                        <div className={styles.flex}>
                          <Image src={following.image} alt="프로필 사진" width={15} height={15} priority className={styles.followImg} />
                          <p className={styles.names}>{following.name}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
              <p className={styles.profileName}>{userInfo.name}</p>
              <p className={styles.profileEmail}>{userInfo.email}</p>
              <p className={styles.profilePoint}>보유 포인트: {userInfo.point}원</p>
            </div>
            <Popover showArrow={true} placement="bottom">
              <PopoverTrigger className={styles.followButton2}>
                <Button className={styles.Followingbtn}>
                  팔로워 {userInfo.follower}
                </Button>
              </PopoverTrigger>
              <PopoverContent className={styles.modal}>
                <ul>
                  {followerList.map((follower) => (
                    <li key={follower.member_id}>
                      <div className={styles.flex}>
                        <Image src={follower.image} alt="프로필 사진" width={15} height={15} priority className={styles.followImg} />
                        <p className={styles.names}>{follower.name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <button className={styles.EditBtn} onClick={handleEditProfileClick} >프로필 수정</button>
          </div>
        </div>
        <button onClick={showProducts} className={currentView === 'products' ? styles.Button1 : styles.Button3}>판매 물품</button>
        <button onClick={showLikes} className={currentView === 'likes' ? styles.Button4 : styles.Button2}>좋아요 목록</button>



        <div className={styles.verticalLine}></div>
        <div className={styles.Lists}>
          {currentView === 'products' && <ProductsComponent userproducts={userproducts} accessToken={accessToken} />}
          {currentView === 'likes' && <LikegridComponent nick_name={userInfo.nick_name} accessToken={accessToken} />}
        </div>
      </>
    </div>
  );
};
