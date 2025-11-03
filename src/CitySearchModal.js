import React, { useState } from 'react';
import './CitySearchModal.css';

function CitySearchModal({ isOpen, onClose, onSelectCity }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/v1/cities?keyword=${encodeURIComponent(searchKeyword)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)

      if (data.code === 'OK' && data.data) {
        setCities(data.data);
        if (data.data.length === 0) {
          setError('검색 결과가 없습니다.');
        }
      } else {
        setError(data.message || '도시 검색에 실패했습니다.');
      }
    } catch (err) {
      setError('도시 검색 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (city) => {
    onSelectCity(city);
    handleClose();
  };

  const handleClose = () => {
    setSearchKeyword('');
    setCities([]);
    setError(null);
    setSearched(false);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>도시 검색</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="search-box">
            <input
              type="text"
              placeholder="도시명을 입력하세요 (예: 서울, 부산)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="search-button"
            >
              {loading ? '검색 중...' : '🔍 검색'}
            </button>
          </div>

          {error && (
            <div className="search-error">
              {error}
            </div>
          )}

          {searched && !loading && cities.length > 0 && (
            <div className="cities-list">
              <p className="result-count">총 {cities.length}개의 도시를 찾았습니다.</p>
              <ul>
                {cities.map((city) => (
                  <li key={city.geonameId} onClick={() => handleSelectCity(city)}>
                    <div className="city-name">
                      {city.fullName}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CitySearchModal;
