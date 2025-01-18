// import {useUpdateUser} from "../api/user.ts";
import {useState, useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

export const EditProfie = () => {
    const {user, setUser} = useAuth();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [message, setMessage] = useState("");

    // const editUser = useUpdateUser();

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // const response = await editUser.mutateAsync({
            //     first_name: firstName,
            //     last_name: lastName,
            //     phone: phone
            // });
            
            const updatedUser = {
                ...user,
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                id: user.id,
                username: user.username,
                bonus: user.bonus
            };
            
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            
            setUser(updatedUser);
            
            setMessage("Профиль успешно обновлен.");
            
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            console.error(err);
            setMessage("Ошибка при обновлении профиля.");
        }
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Редактировать профиль
            </h2>
            
            {message && (
                <div className="mb-4 p-3 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                    {message}
                </div>
            )}
            <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-4">
                    <input 
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Имя"
                        value={firstName}
                    />
                    <input 
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Фамилия"
                        value={lastName}
                    />
                    <input 
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Номер телефона"
                        value={phone}
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 
                             text-white font-medium transition-colors
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                    Обновить профиль
                </button>
            </form>
        </div>
    );
}