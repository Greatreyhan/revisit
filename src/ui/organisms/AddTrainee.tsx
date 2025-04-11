import React, { useState } from 'react';
import InputField from '../molecules/InputField';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { TraineePerson } from '../interface/Training';

interface AddTraineeProps {
    disabled?: boolean;
    trainees: TraineePerson[];
    setTrainees: (trainees: TraineePerson[]) => void;
}

const AddTrainee: React.FC<AddTraineeProps> = ({ disabled=false, trainees, setTrainees }) => {
    const [name, setName] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [score, setScore] = useState<string>('');

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleAddOrUpdateTrainee = () => {
        // Pastikan semua field telah diisi
        if (name && position && age && phone && email && score) {
            // Konversi age dan score ke number
            const newTrainee: TraineePerson = {
                name,
                position,
                age: Number(age),
                phone,
                email,
                score: Number(score)
            };

            if (editIndex !== null) {
                // Update data trainee yang sudah ada
                const updatedTrainees = [...trainees];
                updatedTrainees[editIndex] = newTrainee;
                setTrainees(updatedTrainees);
                setEditIndex(null);
            } else {
                // Tambahkan data trainee baru
                setTrainees([...trainees, newTrainee]);
            }
            resetForm();
        }
    };

    const handleEdit = (index: number) => {
        const trainee = trainees[index];
        setName(trainee.name);
        setPosition(trainee.position);
        setAge(trainee.age.toString());
        setPhone(trainee.phone);
        setEmail(trainee.email);
        setScore(trainee.score.toString());
        setEditIndex(index);
        setIsPopupOpen(true);
    };

    const handleDelete = () => {
        if (editIndex !== null) {
            const updatedTrainees = trainees.filter((_, index) => index !== editIndex);
            setTrainees(updatedTrainees);
            resetForm();
        }
    };

    const resetForm = () => {
        setName('');
        setPosition('');
        setAge('');
        setPhone('');
        setEmail('');
        setScore('');
        setIsPopupOpen(false);
        setEditIndex(null);
    };

    return (
        <div>
            {/* Tampilan List Trainee */}
            <div className="mt-4">
                <table className="table p-4 bg-white rounded-lg shadow w-full">
                    <thead>
                        <tr>
                            <th className="border p-1.5 text-gray-900">#</th>
                            <th className="border p-1.5 text-gray-900">Name</th>
                            <th className="border p-1.5 text-gray-900">Position</th>
                            <th className="border p-1.5 text-gray-900">Age</th>
                            <th className="border p-1.5 text-gray-900">Phone</th>
                            <th className="border p-1.5 text-gray-900">Email</th>
                            <th className="border p-1.5 text-gray-900">Score</th>
                            <th className="border p-1.5 text-gray-900">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainees.map((trainee, index) => (
                            <tr key={index} className="text-gray-700">
                                <td className="border p-1.5 text-center">{index + 1}</td>
                                <td className="border p-1.5 text-center">{trainee.name}</td>
                                <td className="border p-1.5 text-center">{trainee.position}</td>
                                <td className="border p-1.5 text-center">{trainee.age}</td>
                                <td className="border p-1.5 text-center">{trainee.phone}</td>
                                <td className="border p-1.5 text-center">{trainee.email}</td>
                                <td className="border p-1.5 text-center">{trainee.score}</td>
                                <td className="border p-1.5 text-center flex justify-center gap-x-3">
                                    <button
                                        type="button"
                                        className="p-2 text-sky-800 bg-sky-100 rounded-full"
                                        onClick={() => handleEdit(index)}
                                    >
                                        <MdEdit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {disabled ? 
                <button
                    type="button"
                    onClick={() => setIsPopupOpen(true)}
                    className="mt-4 px-6 py-2 w-full flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                >
                    <MdAdd className="mr-2" />
                    Tambah Trainee
                </button>
                :<></>}
            </div>

            {/* Popup Form */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-40">
                    <div className="bg-white p-6 rounded shadow-lg md:w-1/3">
                        <h2 className="text-lg font-bold mb-4">Tambah Trainee</h2>
                        <div className='flex gap-x-5'>
                            <InputField
                                label="Name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Masukkan name"
                            />
                            <InputField
                                label="Position"
                                name="position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                placeholder="Masukkan position"
                            />
                        </div>
                        <div className='flex gap-x-5'>
                            <InputField
                                type="number"
                                label="Age"
                                name="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Masukkan age"
                            />
                            <InputField
                                label="Phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Masukkan phone"
                            />
                        </div>
                        <div className='flex gap-x-5'>
                            <InputField
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Masukkan email"
                            />
                            <InputField
                                type="number"
                                label="Score"
                                name="score"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                placeholder="Masukkan score"
                            />
                        </div>
                        <div className="flex justify-end gap-5 mt-4">
                            <button
                                type="button"
                                className="bg-white text-primary px-4 py-2 rounded-md"
                                onClick={() => resetForm()}
                            >
                                Batal
                            </button>
                            {editIndex !== null && (
                                <button
                                    type="button"
                                    className="text-white bg-primary px-4 py-2 rounded-md flex items-center"
                                    onClick={handleDelete}
                                >
                                    <MdDelete className="mr-1" />
                                    Hapus
                                </button>
                            )}
                            <button
                                type="button"
                                className="text-white bg-primary px-4 py-2 rounded-md"
                                onClick={handleAddOrUpdateTrainee}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTrainee;
