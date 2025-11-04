import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SajuResult.css';

function SajuResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="saju-result-container">
        <div className="error-message">
          <h3>조회 결과가 없습니다</h3>
          <p>사주 조회를 먼저 진행해주세요.</p>
          <button onClick={() => navigate('/')} className="back-button">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const { code, message, data } = result;
  const isSuccess = code === 'OK';

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

  return (
    <div className="saju-result-container">
      <h1>사주 만세력 결과</h1>

      <button onClick={() => navigate('/')} className="back-button">
        ← 새로운 조회
      </button>

      {!isSuccess && (
        <div className="error-message">
          <h3>조회 실패</h3>
          <p>{message || '사주 조회에 실패했습니다.'}</p>
        </div>
      )}

      {isSuccess && data && (
        <div className="result-content">
          {/* 사주 팔자 */}
          {data.saju && (
            <div className="result-section">
              <h2>사주 팔자 (四柱八字)</h2>
              <div className="saju-pillars-horizontal">
                <div className="pillar-column">
                  <h3>시주 (時柱)</h3>
                  {renderPillarElement(data.saju.timeSky, '시간')}
                  {renderPillarElement(data.saju.timeGround, '시지')}
                </div>
                <div className="pillar-column">
                  <h3>일주 (日柱)</h3>
                  {renderPillarElement(data.saju.daySky, '일간')}
                  {renderPillarElement(data.saju.dayGround, '일지')}
                </div>
                <div className="pillar-column">
                  <h3>월주 (月柱)</h3>
                  {renderPillarElement(data.saju.monthSky, '월간')}
                  {renderPillarElement(data.saju.monthGround, '월지')}
                </div>
                <div className="pillar-column">
                  <h3>년주 (年柱)</h3>
                  {renderPillarElement(data.saju.yearSky, '년간')}
                  {renderPillarElement(data.saju.yearGround, '년지')}
                </div>
              </div>

              {data.saju.bigFortuneNumber !== undefined && (
                <div className="basic-info">
                  <div className="info-row">
                    <span className="info-label">대운수:</span>
                    <span className="info-value">{data.saju.bigFortuneNumber}</span>
                  </div>
                  {data.saju.bigFortuneStartYear && (
                    <div className="info-row">
                      <span className="info-label">대운 시작년도:</span>
                      <span className="info-value">{data.saju.bigFortuneStartYear}년</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 운세 정보 */}
          {data.fortune && (
            <div className="result-section">
              <h2>운세 정보</h2>
              <div className="fortune-grid">
                {renderFortune(data.fortune.bigFortune, '대운 (大運)')}
                {renderFortune(data.fortune.smallFortune, '세운 (歲運)')}
                {renderFortune(data.fortune.monthFortune, '월운 (月運)')}
                {renderFortune(data.fortune.dayFortune, '일운 (日運)')}
              </div>
            </div>
          )}

          {/* 시간 조정 정보 */}
          {data.saju?.timeAdjustment && (
            <div className="result-section">
              <h2>시간 조정 정보</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">경도 조정:</span>
                  <span className="info-value">
                    {data.saju.timeAdjustment.longitudeAdjustmentMinutes?.toFixed(2)}분
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">섬머타임:</span>
                  <span className="info-value">
                    {data.saju.timeAdjustment.isDaylightSavingTime ? '적용(-60분)' : '미적용'}
                  </span>
                </div>
                {data.saju.timeAdjustment.totalAdjustmentMinutes !== undefined && (
                  <div className="info-item">
                    <span className="info-label">총 조정:</span>
                    <span className="info-value">
                      {data.saju.timeAdjustment.totalAdjustmentMinutes?.toFixed(2)}분
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SajuResult;
