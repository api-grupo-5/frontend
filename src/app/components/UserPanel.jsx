'use client';
import { useAuth } from '../context/LoginManagement';
import { useState, useEffect } from 'react';
import { getUserProfile } from '../context/LoginManagement';
import { updateUserProfile } from '../context/LoginManagement';
import styles from '../css/userPanel.module.css';

export default function UserPanel() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('compras');
  const [profile, setProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    image: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile({
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address
        });
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: URL.createObjectURL(file) });
    }
  };

    const handleSaveChanges = async () => {
        try {
        await updateUserProfile(profile);
        alert("✅ Datos actualizados correctamente");
        } catch (err) {
        console.error(err);
        alert("❌ Error al actualizar perfil");
        }
    };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const renderTab = () => {
    switch (activeTab) {
        case 'compras':
        return <div>🔍 Historial de compras (próximamente)</div>;
        case 'ventas':
        return <div>💸 Historial de ventas (próximamente)</div>;
        case 'perfil':
        return (
            <div className={styles.profileForm}>
            <label>Nombre:</label>
            <input type="text" name="firstName" value={profile.firstName} onChange={handleInputChange} />
            
            <label>Apellido:</label>
            <input type="text" name="lastName" value={profile.lastName} onChange={handleInputChange} />
            
            <label>Teléfono:</label>
            <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} />
            
            <label>Dirección:</label>
            <input type="text" name="address" value={profile.address} onChange={handleInputChange} />
            
            <button onClick={handleSaveChanges}>Guardar cambios</button>
            </div>
    );
        default:
        return null;
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        {profile.image && <img src={profile.image} alt="Perfil" className={styles.avatar} />}
        <h2>Hola, {profile.firstName} {profile.lastName}!</h2>
        <p>Email: {profile.email}</p>
        <button onClick={logout} className={styles.logoutButton}>Cerrar sesión</button>
      </div>

      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('compras')}>📦 Compras</button>
        <button onClick={() => setActiveTab('ventas')}>🧾 Ventas</button>
        <button onClick={() => setActiveTab('perfil')}>🛠 Perfil</button>
      </div>

      <div className={styles.tabContent}>
        {renderTab()}
      </div>
    </div>
  );
}
