import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CitySearchModal from './CitySearchModal';
import './SajuForm.css';

function SajuForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    gender: 1,
    birthdayType: 'SOLAR',
    isLeapMonth: false,
    isDaylightSavingTime: false,
    geonameId: ''
  });

  const [selectedCityName, setSelectedCityName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({
      ...prev,
      geonameId: city.geonameId
    }));
    setSelectedCityName(city.name);
  };

  const handleTimeUnknown = (e) => {
    const checked = e.target.checked;
    setIsTimeUnknown(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        birthTime: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 쿼리 파라미터 생성
      const params = new URLSearchParams({
        birthDate: formData.birthDate,
        gender: formData.gender,
        birthdayType: formData.birthdayType,
        isLeapMonth: formData.isLeapMonth,
        isDaylightSavingTime: formData.isDaylightSavingTime,
        geonameId: formData.geonameId
      });

      if (formData.birthTime) {
        params.append('birthTime', formData.birthTime);
      }

      const response = await fetch(`/api/v1/manse?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 결과 페이지로 이동
      navigate('/result', { state: { result: data } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saju-form-container">
      <h1>사주 만세력 조회</h1>

      <form onSubmit={handleSubmit} className="saju-form">
        <div className="form-group">
          <label htmlFor="birthDate">생년월일 *</label>
          <input
            type="text"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            placeholder="19911103"
            pattern="^(19[0-9]{2}|20[0-4][0-9]|2050)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$"
            required
          />
          <span className="helper-text">YYYYMMDD 형식 (예: 19911103, 20000201)</span>
        </div>

        <div className="form-group">
          <label htmlFor="birthTime">출생시간</label>
          <input
            type="text"
            id="birthTime"
            name="birthTime"
            value={formData.birthTime}
            onChange={handleChange}
            placeholder="0657"
            pattern="^([01][0-9]|2[0-3])[0-5][0-9]$"
            disabled={isTimeUnknown}
          />
          <span className="helper-text">HHMM 형식 (예: 0657, 1430) - 선택사항</span>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isTimeUnknown}
              onChange={handleTimeUnknown}
            />
            시간 모름
          </label>
        </div>

        <div className="form-group">
          <label>성별 *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="1"
                checked={formData.gender === '1' || formData.gender === 1}
                onChange={handleChange}
              />
              남자
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="0"
                checked={formData.gender === '0' || formData.gender === 0}
                onChange={handleChange}
              />
              여자
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>생일 종류 *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="birthdayType"
                value="SOLAR"
                checked={formData.birthdayType === 'SOLAR'}
                onChange={handleChange}
              />
              양력
            </label>
            <label>
              <input
                type="radio"
                name="birthdayType"
                value="LUNAR"
                checked={formData.birthdayType === 'LUNAR'}
                onChange={handleChange}
              />
              음력
            </label>
          </div>
        </div>

        {formData.birthdayType === 'LUNAR' && (
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isLeapMonth"
                checked={formData.isLeapMonth}
                onChange={handleChange}
              />
              윤달
            </label>
          </div>
        )}

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isDaylightSavingTime"
              checked={formData.isDaylightSavingTime}
              onChange={handleChange}
            />
            섬머타임 적용
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="cityName">출생 도시 *</label>
          <div className="input-with-button">
            <input
              type="text"
              id="cityName"
              name="cityName"
              value={selectedCityName}
              placeholder="도시명을 입력하세요"
              readOnly
              required
            />
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="search-icon-button"
              title="도시 검색"
            >
              🔍
            </button>
          </div>
          <span className="helper-text">돋보기 버튼을 클릭하여 도시를 검색하세요</span>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? '조회 중...' : '사주 조회'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <h3>오류 발생</h3>
          <p>{error}</p>
        </div>
      )}

      <CitySearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCity={handleCitySelect}
      />
    </div>
  );
}

export default SajuForm;
