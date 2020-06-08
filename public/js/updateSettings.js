import axios from 'axios';
import { showAlert } from './alerts';

// type = 'password' | 'data'
export const updateSettings = async (type, data) => {
    const url =
        type === 'password'
            ? '/api/v1/users/updateMyPassword'
            : '/api/v1/users/updateMe';
    try {
        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
