import React, { useState, useRef } from 'react';
import CitySearchModal from './CitySearchModal';
import './SajuForm.css';

function SajuForm() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    gender: 1,
    birthdayType: 'SOLAR',
    isLeapMonth: false,
    geonameId: ''
  });

  const [selectedCityName, setSelectedCityName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

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
        isDaylightSavingTime: false,
        geonameId: formData.geonameId
      });

      if (formData.birthTime) {
        params.append('birthTime', formData.birthTime);
      }

      const response = await fetch(`/api/v1//manse?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 결과를 state에 저장
      setResult(data);

      // 결과 영역으로 스크롤
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const renderPillarElement = (element, label) => {
    if (!element) return null;

    return (
      <div className="pillar-element">
        <div className="element-label">{label}</div>
        <div
          className="element-box"
          style={{ backgroundColor: element.fiveCircleColor || '#666' }}
        >
          <div className="element-chinese">{element.chinese || '-'}</div>
          <div className="element-korean">{element.korean || '-'}</div>
        </div>
        <div className="element-info">
          <span className="element-detail">{element.fiveCircle || '-'}</span>
          <span className="element-detail">{element.tenStar || '-'}</span>
        </div>
      </div>
    );
  };

  const renderFortune = (fortune, title) => {
    if (!fortune) return null;

    return (
      <div className="fortune-item">
        <h4>{title}</h4>
        <div className="fortune-content">
          <div className="fortune-number">{fortune.number}</div>
          <div className="fortune-pillars">
            <div
              className="fortune-element"
              style={{ backgroundColor: fortune.sky?.fiveCircleColor || '#666' }}
            >
              <div className="fortune-chinese">{fortune.sky?.chinese || '-'}</div>
              <div className="fortune-korean">{fortune.sky?.korean || '-'}</div>
            </div>
            <div
              className="fortune-element"
              style={{ backgroundColor: fortune.ground?.fiveCircleColor || '#666' }}
            >
              <div className="fortune-chinese">{fortune.ground?.chinese || '-'}</div>
              <div className="fortune-korean">{fortune.ground?.korean || '-'}</div>
            </div>
          </div>
          <div className="fortune-details">
            {fortune.sky && (
              <div className="fortune-detail-row">
                <span>{fortune.sky.fiveCircle}</span>
                <span>{fortune.sky.tenStar}</span>
              </div>
            )}
            {fortune.ground && (
              <div className="fortune-detail-row">
                <span>{fortune.ground.fiveCircle}</span>
                <span>{fortune.ground.tenStar}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBigFortuneItem = (fortune) => {
    if (!fortune) return null;

    return (
      <div className="big-fortune-item">
        <div className="big-fortune-age">{fortune.number}세</div>
        <div className="big-fortune-pillars">
          <div
            className="big-fortune-element"
            style={{ backgroundColor: fortune.sky?.fiveCircleColor || '#666' }}
          >
            <div className="big-fortune-chinese">{fortune.sky?.chinese || '-'}</div>
            <div className="big-fortune-korean">{fortune.sky?.korean || '-'}</div>
          </div>
          <div
            className="big-fortune-element"
            style={{ backgroundColor: fortune.ground?.fiveCircleColor || '#666' }}
          >
            <div className="big-fortune-chinese">{fortune.ground?.chinese || '-'}</div>
            <div className="big-fortune-korean">{fortune.ground?.korean || '-'}</div>
          </div>
        </div>
        <div className="big-fortune-details">
          {fortune.sky && (
            <div className="big-fortune-detail-row">
              <span>{fortune.sky.fiveCircle}</span>
              <span>{fortune.sky.tenStar}</span>
            </div>
          )}
          {fortune.ground && (
            <div className="big-fortune-detail-row">
              <span>{fortune.ground.fiveCircle}</span>
              <span>{fortune.ground.tenStar}</span>
            </div>
          )}
        </div>
      </div>
    );
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

      {/* 결과 영역 */}
      {result && (
        <div className="result-section-container" ref={resultRef}>
          <div className="result-header">
            <h2>사주 만세력 결과</h2>
            <button
              onClick={() => setResult(null)}
              className="clear-result-button"
            >
              결과 지우기
            </button>
          </div>

          {result.code !== 'OK' && (
            <div className="error-message">
              <h3>조회 실패</h3>
              <p>{result.message || '사주 조회에 실패했습니다.'}</p>
            </div>
          )}

          {result.code === 'OK' && result.data && (
            <div className="result-content">
              {/* 사주 팔자 */}
              {result.data.saju && (
                <div className="result-section">
                  <h3>사주 팔자 (四柱八字)</h3>
                  <div className="saju-pillars-horizontal">
                    <div className="pillar-column">
                      <h4>시주 (時柱)</h4>
                      {renderPillarElement(result.data.saju.timeSky, '시간')}
                      {renderPillarElement(result.data.saju.timeGround, '시지')}
                    </div>
                    <div className="pillar-column">
                      <h4>일주 (日柱)</h4>
                      {renderPillarElement(result.data.saju.daySky, '일간')}
                      {renderPillarElement(result.data.saju.dayGround, '일지')}
                    </div>
                    <div className="pillar-column">
                      <h4>월주 (月柱)</h4>
                      {renderPillarElement(result.data.saju.monthSky, '월간')}
                      {renderPillarElement(result.data.saju.monthGround, '월지')}
                    </div>
                    <div className="pillar-column">
                      <h4>년주 (年柱)</h4>
                      {renderPillarElement(result.data.saju.yearSky, '년간')}
                      {renderPillarElement(result.data.saju.yearGround, '년지')}
                    </div>
                  </div>

                  {result.data.saju.bigFortuneNumber !== undefined && (
                    <div className="basic-info">
                      <div className="info-row">
                        <span className="info-label">대운수:</span>
                        <span className="info-value">{result.data.saju.bigFortuneNumber}</span>
                      </div>
                      {result.data.saju.bigFortuneStartYear && (
                        <div className="info-row">
                          <span className="info-label">대운 시작년도:</span>
                          <span className="info-value">{result.data.saju.bigFortuneStartYear}년, {result.data.saju.bigFortuneDirection}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 운세 정보 */}
              {result.data.fortune && (
                <div className="result-section">
                  <h3>운세 정보</h3>
                  <div className="fortune-grid">
                    {renderFortune(result.data.fortune.bigFortune, '대운 (大運)')}
                    {renderFortune(result.data.fortune.smallFortune, '세운 (歲運)')}
                    {renderFortune(result.data.fortune.monthFortune, '월운 (月運)')}
                    {renderFortune(result.data.fortune.dayFortune, '일운 (日運)')}
                  </div>
                </div>
              )}

              {/* 대운 정보 */}
              {result.data.bigFortuneList && result.data.bigFortuneList.length > 0 && (
                <div className="result-section">
                  <h3>대운 (大運)</h3>
                  <div className="big-fortune-container">
                    <div className="big-fortune-scroll">
                      {result.data.bigFortuneList.map((fortune, index) => (
                        <div key={index}>
                          {renderBigFortuneItem(fortune)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 시간 조정 정보 */}
              {result.data.saju?.timeAdjustment && (
                <div className="result-section">
                  <h3>시간 조정 정보</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">경도 조정:</span>
                      <span className="info-value">
                        {result.data.saju.timeAdjustment.longitudeAdjustmentMinutes?.toFixed(2)}분
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">섬머타임:</span>
                      <span className="info-value">
                        {result.data.saju.timeAdjustment.isDaylightSavingTime ? '적용(-60분)' : '미적용'}
                      </span>
                    </div>
                    {result.data.saju.timeAdjustment.totalAdjustmentMinutes !== undefined && (
                      <div className="info-item">
                        <span className="info-label">총 조정:</span>
                        <span className="info-value">
                          {result.data.saju.timeAdjustment.totalAdjustmentMinutes?.toFixed(2)}분
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SajuForm;
