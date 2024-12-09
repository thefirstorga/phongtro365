import React, { useEffect, useState } from 'react';
import PhotoUploader from '../components/PhotoUploader';
import Perks from '../components/Perks';
import axios from 'axios';
import LocationPicker from '../components/LocationPicker';
import { Navigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import CSS cho Quill

function PlacesFormPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [description, setDescription] = useState(''); // Use Quill for this
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState(''); // Use Quill for this
    const [area, setArea] = useState(30);
    const [duration, setDuration] = useState(6);
    const [price, setPrice] = useState(2.5);
    const [redirect, setRedirect] = useState(false);
    
    // Error states for each field
    const [titleError, setTitleError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [photosError, setPhotosError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [areaError, setAreaError] = useState('');
    const [durationError, setDurationError] = useState('');
    const [priceError, setPriceError] = useState('');

    useEffect(() => {
        if (!id) return;
        axios.get('/post/place/' + id).then(response => {
            let { data } = response;
            data = data.place;
            setTitle(data.title);
            setAddress(data.address);
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            const photos = data.photos.map(photoGet => photoGet.url);
            setAddedPhotos(photos);
            setDescription(data.description);
            const perks = data.perks.map(perkGet => perkGet.perk);
            setPerks(perks);
            setExtraInfo(data.extraInfo);
            setArea(data.area);
            setDuration(data.duration);
            setPrice(data.price);
        });
    }, [id]);

    // Hàm kiểm tra tính hợp lệ
    function validateForm() {
        let isValid = true;

        // Kiểm tra các trường bắt buộc
        if (!title) {
            setTitleError('Vui lòng nhập tiêu đề');
            isValid = false;
        } else {
            setTitleError('');
        }

        if (!address) {
            setAddressError('Vui lòng nhập địa chỉ');
            isValid = false;
        } else {
            setAddressError('');
        }

        if (addedPhotos.length < 3) {
            setPhotosError('Vui lòng chọn ít nhất 3 hình ảnh');
            isValid = false;
        } else {
            setPhotosError('');
        }

        if (!description) {
            setDescriptionError('Vui lòng nhập mô tả');
            isValid = false;
        } else {
            setDescriptionError('');
        }

        if (!area) {
            setAreaError('Vui lòng nhập diện tích');
            isValid = false;
        } else {
            setAreaError('');
        }

        if (!duration) {
            setDurationError('Vui lòng nhập thời hạn hợp đồng');
            isValid = false;
        } else {
            setDurationError('');
        }

        if (!price) {
            setPriceError('Vui lòng nhập giá');
            isValid = false;
        } else {
            setPriceError('');
        }

        return isValid;
    }

    async function savePlace(ev) {
        ev.preventDefault();
        // Kiểm tra form trước khi lưu
        if (!validateForm()) return;

        const placeData = {
            title, address, latitude, longitude, 
            addedPhotos, 
            description, perks, extraInfo, 
            area, duration, price
        };

        if (id) {
            await axios.put('/post/places/' + id, { id, ...placeData });
        } else {
            await axios.post('/post/places', placeData);
        }
        setRedirect(true);
    }

    // Hàm để xử lý thay đổi ở các trường nhập liệu
    function handleInputChange(setState, fieldErrorSetter) {
        return (ev) => {
            const { value } = ev.target;
            setState(value);
            if (value) {
                fieldErrorSetter('');  // Ẩn lỗi khi người dùng nhập
            }
        };
    }

    // Định nghĩa lại hàm preInput
    function preInput(header, description) {
        return (
            <>
                <h2 className='text-2xl mt-4'>{header}</h2>
                <p className='text-gray-500 text-sm'>{description}</p>
            </>
        );
    }

    if (redirect) return <Navigate to={'/account/places'} />;

    return (
        <div>
            <form onSubmit={savePlace}>
                {preInput('Tiêu đề *', 'Nhập tiêu đề của bạn')}
                <input 
                    type='text' 
                    value={title}
                    onChange={handleInputChange(setTitle, setTitleError)}
                    placeholder='Tiêu đề'
                    className={titleError ? 'border-red-500' : ''}
                />
                {titleError && <p className="text-red-500 text-sm">{titleError}</p>}

                {preInput('Địa chỉ *', 'Nhập địa chỉ nhà bạn')}
                <input 
                    type='text' 
                    value={address}
                    onChange={handleInputChange(setAddress, setAddressError)}
                    placeholder='Địa chỉ'
                    className={addressError ? 'border-red-500' : ''}
                />
                {addressError && <p className="text-red-500 text-sm">{addressError}</p>}

                <h2 className="text-2xl mt-4">Chọn trên bản đồ</h2>
                {latitude && (
                    <p>(Bạn đã chọn địa chỉ, tuy nhiên vẫn có thể đổi)</p>
                )}
                <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onChange={({ latitude, longitude }) => {
                        setLatitude(latitude);
                        setLongitude(longitude);
                    }}
                />

                {preInput('Hình ảnh *', 'Chọn hình ảnh')}
                    <PhotoUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} />
                {photosError && <p className="text-red-500 text-sm">{photosError}</p>}

                {preInput('Mô tả *', 'Vui lòng mô tả chi tiết nhà bạn')}
                <ReactQuill 
                    value={description} 
                    onChange={setDescription} 
                    className={descriptionError ? 'border-red-500' : ''}
                    placeholder="Nhập mô tả nhà bạn"
                />
                {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}

                {preInput('Dịch vụ', 'Chọn dịch vụ nhà bạn')}
                <div className='grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                {preInput('Thông tin thêm', 'Nhập thông tin thêm của nhà')}
                <ReactQuill 
                    value={extraInfo} 
                    onChange={setExtraInfo} 
                    placeholder="Nhập thông tin thêm về nhà"
                />

                {preInput('Diện tích - Thời hạn hợp đồng - Giá *', 'Nhập đầy đủ 3 trường sau')}
                <div className='grid gap-2 sm:grid-cols-3 lg:grid-cols-3'>
                    <div>
                        <h3 className='mt-2 -mb-1'>Diện tích - mét vuông</h3>
                        <input 
                            type="number" 
                            value={area}
                            onChange={handleInputChange(setArea, setAreaError)}
                            className={areaError ? 'border-red-500' : ''}
                        />
                        {areaError && <p className="text-red-500 text-sm">{areaError}</p>}
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Thời hạn - tháng</h3>
                        <input 
                            type="number" 
                            value={duration}
                            onChange={handleInputChange(setDuration, setDurationError)}
                            className={durationError ? 'border-red-500' : ''}
                        />
                        {durationError && <p className="text-red-500 text-sm">{durationError}</p>}
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Giá - triệu/tháng</h3>
                        <input 
                            type="number" 
                            value={price}
                            onChange={handleInputChange(setPrice, setPriceError)}
                            className={priceError ? 'border-red-500' : ''}
                        />
                        {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
                    </div>
                </div>

                <button className='primary my-4'>Lưu</button>
            </form>
        </div>
    );
}

export default PlacesFormPage;
