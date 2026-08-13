import React, { useEffect } from 'react'
import { useAppStore } from '../store/appStore';
import { api } from '../api/axios';

const Dashboard = () => {
    const user = useAppStore((state) => state.user);
    useEffect(() => {
        const me = async () => {
            try {
                const response =  await api.get("/auth/me");
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }   
        }
        me()
    },[])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard