/* eslint disable */
import { showAlert } from './alerts';
import axios from 'axios';

export const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async function () {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if (res.data.status === 'success') {
            location.reload(true);
        }
        showAlert('success', 'Logged out successfully...');
    } catch (err) {
        showAlert('error', 'Erorr logging out! Try again!');
    }
};
