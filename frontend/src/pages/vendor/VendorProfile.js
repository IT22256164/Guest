import React from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const VendorProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const teachStable = currentUser.teachStable
  const teachNote = currentUser.teachNote
  const teachEvent = currentUser.event

  return (
    <>
      <ProfileCard>
        <ProfileCardContent>
          <ProfileText>Name: {currentUser.name}</ProfileText>
          <ProfileText>Email: {currentUser.email}</ProfileText>
          <ProfileText>Table: {teachStable.stableName}</ProfileText>
          <ProfileText>Note: {teachNote.subName}</ProfileText>
          <ProfileText>Event: {teachEvent.eventName}</ProfileText>
        </ProfileCardContent>
      </ProfileCard>
    </>
  )
}

export default VendorProfile

const ProfileCard = styled(Card)`
  margin: 20px;
  width: 400px;
  border-radius: 10px;
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileText = styled(Typography)`
  margin: 10px;
`;