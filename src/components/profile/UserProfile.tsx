import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_pic: string | null;
    // Add other user fields as per your DRF User model/serializer
}

export const AdminUserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [newPin, setNewPin] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [displayPinDialog, setDisplayPinDialog] = useState<boolean>(false);
    const [displayPasswordDialog, setDisplayPasswordDialog] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const user_id = localStorage.getItem('user_id');

    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Replace with your DRF API base URL

    


    const fetchUserDetails = async (id: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<User>(`/users/profile/${user_id}/`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch user details.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user) {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const handleProfileUpdate = async () => {
        if (!user) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('first_name', user.first_name);
            formData.append('last_name', user.last_name);

            // Use the state variable for the selected file
            if (selectedFile) {
                formData.append('profile_pic', selectedFile);
            } else if (user.profile_pic && !selectedFile) {
                // If user previously had a pic and no new one is selected,
                // you might want to send a signal to the backend to clear it.
                // This depends on your DRF serializer/view logic.
                // For example, if your serializer allows `profile_pic=null`
                // formData.append('profile_pic', ''); // Send empty string or a special marker
            }


            await axiosInstance.patch(`/users/${user.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer YOUR_AUTH_TOKEN`,
                },
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully!',
            });
            fetchUserDetails(user.id);
            setSelectedFile(null); // Clear selected file after successful upload
            fileUploadRef.current?.clear(); // Clear the file input visually
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.detail || 'Failed to update profile.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handlePinUpdate = async () => {
        if (!user) return;
        if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'PIN must be a 4-digit number.' });
            return;
        }
        setSubmitting(true);
        try {
            await axiosInstance.put(`/users/${user.id}/update-pin/`, { new_pin: newPin }, {
                headers: {
                    Authorization: `Bearer YOUR_AUTH_TOKEN`,
                },
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'PIN updated successfully!',
            });
            setNewPin('');
            setDisplayPinDialog(false);
        } catch (error: any) {
            console.error('Error updating PIN:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.new_pin?.[0] || error.response?.data?.detail || 'Failed to update PIN.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!user) return;
        if (newPassword !== confirmPassword) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Passwords do not match.' });
            return;
        }
        if (newPassword.length < 8) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Password must be at least 8 characters long.' });
            return;
        }
        setSubmitting(true);
        try {
            await axiosInstance.put(`/users/${user.id}/change-password/`, { new_password: newPassword }, {
                headers: {
                    Authorization: `Bearer YOUR_AUTH_TOKEN`,
                },
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Password updated successfully!',
            });
            setNewPassword('');
            setConfirmPassword('');
            setDisplayPasswordDialog(false);
        } catch (error: any) {
            console.error('Error updating password:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.new_password?.[0] || error.response?.data?.detail || 'Failed to update password.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const onProfilePicSelect = (e: FileUploadSelectEvent) => {
        if (e.files && e.files.length > 0) {
            setSelectedFile(e.files[0]); // Store the first selected file
            toast.current?.show({ severity: 'info', summary: 'File Selected', detail: e.files[0].name });
        }
    };

    // Add onClear to reset selectedFile state if the user clears the selection
    const onProfilePicClear = () => {
        setSelectedFile(null);
        toast.current?.show({ severity: 'info', summary: 'File Cleared', detail: 'Profile picture selection removed.' });
    };

    if (loading) {
        return <div className="p-d-flex p-jc-center p-ai-center" style={{ minHeight: '100vh' }}>Loading user data...</div>;
    }

    if (!user) {
        return <div className="p-d-flex p-jc-center p-ai-center" style={{ minHeight: '100vh' }}>User not found.</div>;
    }

    const pinDialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setDisplayPinDialog(false)} className="p-button-text" />
            <Button label="Update PIN" icon="pi pi-check" onClick={handlePinUpdate} loading={submitting} />
        </div>
    );

    const passwordDialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setDisplayPasswordDialog(false)} className="p-button-text" />
            <Button label="Update Password" icon="pi pi-check" onClick={handlePasswordUpdate} loading={submitting} />
        </div>
    );

    return (
        <div className="p-d-flex p-jc-center p-py-5">
            <Toast ref={toast} />
            <Card title={`Admin User Profile: ${user.first_name} ${user.last_name}`} className="p-shadow-2" style={{ width: '500px' }}>
                <div className="p-fluid">
                    <div className="p-field p-mb-4">
                        <label htmlFor="first_name">First Name</label>
                        <InputText
                            id="first_name"
                            name="first_name"
                            value={user.first_name}
                            onChange={handleFieldChange}
                        />
                    </div>

                    <div className="p-field p-mb-4">
                        <label htmlFor="last_name">Last Name</label>
                        <InputText
                            id="last_name"
                            name="last_name"
                            value={user.last_name}
                            onChange={handleFieldChange}
                        />
                    </div>

                    <div className="p-field p-mb-4">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={user.email} disabled />
                    </div>

                    <div className="p-field p-mb-4">
                        <label htmlFor="profile_pic">Profile Picture</label>
                        {user.profile_pic && (
                            <div className="p-mb-2">
                                <img
                                    src={user.profile_pic}
                                    alt="Profile"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            </div>
                        )}
                        <FileUpload
                            ref={fileUploadRef}
                            name="profile_pic"
                            mode="basic"
                            accept="image/*"
                            maxFileSize={1000000} // 1MB
                            auto={false} // We will manually upload on form submit
                            chooseLabel="Select New Picture"
                            onSelect={onProfilePicSelect}
                            onClear={() => {
                                // Logic to clear profile pic on backend if user wants to remove it
                                // This might require a separate API call or a specific flag in the update request
                                if (user) setUser({ ...user, profile_pic: null });
                            }}
                            className="p-d-block"
                        />
                         <small className="p-error">
                            To update profile picture, select a new file and click "Update Profile".
                        </small>
                    </div>

                    <Button
                        label="Update Profile"
                        icon="pi pi-save"
                        onClick={handleProfileUpdate}
                        loading={submitting}
                        className="p-button-primary p-mb-4"
                    />

                    <Divider />

                    <div className="p-mb-4">
                        <Button
                            label="Update User PIN"
                            icon="pi pi-key"
                            className="p-button-secondary p-d-block p-mb-2"
                            onClick={() => setDisplayPinDialog(true)}
                        />
                        <Button
                            label="Change User Password"
                            icon="pi pi-lock"
                            className="p-button-secondary p-d-block"
                            onClick={() => setDisplayPasswordDialog(true)}
                        />
                    </div>
                </div>
            </Card>

            {/* Update PIN Dialog */}
            <Dialog
                header="Update User PIN"
                visible={displayPinDialog}
                style={{ width: '400px' }}
                modal
                footer={pinDialogFooter}
                onHide={() => setDisplayPinDialog(false)}
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="newPin">New PIN (4 Digits)</label>
                        <InputText
                            id="newPin"
                            type="password"
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value)}
                            maxLength={4}
                            keyfilter="num"
                        />
                    </div>
                </div>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog
                header="Change User Password"
                visible={displayPasswordDialog}
                style={{ width: '400px' }}
                modal
                footer={passwordDialogFooter}
                onHide={() => setDisplayPasswordDialog(false)}
            >
                <div className="p-fluid">
                    <div className="p-field p-mb-3">
                        <label htmlFor="newPassword">New Password</label>
                        <Password
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            toggleMask
                            feedback={false} // Set to true for password strength feedback
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <Password
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            toggleMask
                            feedback={false}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};