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

  const { success, message, data } = result;

  return (
    <div className="saju-result-container">
      <h1>사주 조회 결과</h1>

      <button onClick={() => navigate('/')} className="back-button">
        ← 새로운 조회
      </button>

      {!success && (
        <div className="error-message">
          <h3>조회 실패</h3>
          <p>{message || '사주 조회에 실패했습니다.'}</p>
        </div>
      )}

      {success && data && (
        <div className="result-content">
          <div className="result-section">
            <h2>기본 정보</h2>
            <div className="info-grid">
              {data.birthDate && (
                <div className="info-item">
                  <span className="info-label">생년월일:</span>
                  <span className="info-value">{data.birthDate}</span>
                </div>
              )}
              {data.birthTime && (
                <div className="info-item">
                  <span className="info-label">출생시간:</span>
                  <span className="info-value">{data.birthTime}</span>
                </div>
              )}
              {data.gender !== undefined && (
                <div className="info-item">
                  <span className="info-label">성별:</span>
                  <span className="info-value">{data.gender === 1 ? '남자' : '여자'}</span>
                </div>
              )}
              {data.birthdayType && (
                <div className="info-item">
                  <span className="info-label">생일 구분:</span>
                  <span className="info-value">{data.birthdayType === 'SOLAR' ? '양력' : '음력'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="result-section">
            <h2>사주 정보</h2>
            <div className="saju-pillars">
              {data.yearPillar && (
                <div className="pillar">
                  <h3>년주 (年柱)</h3>
                  <div className="pillar-content">
                    <div className="stem">{data.yearPillar.heavenlyStem || '-'}</div>
                    <div className="branch">{data.yearPillar.earthlyBranch || '-'}</div>
                  </div>
                </div>
              )}
              {data.monthPillar && (
                <div className="pillar">
                  <h3>월주 (月柱)</h3>
                  <div className="pillar-content">
                    <div className="stem">{data.monthPillar.heavenlyStem || '-'}</div>
                    <div className="branch">{data.monthPillar.earthlyBranch || '-'}</div>
                  </div>
                </div>
              )}
              {data.dayPillar && (
                <div className="pillar">
                  <h3>일주 (日柱)</h3>
                  <div className="pillar-content">
                    <div className="stem">{data.dayPillar.heavenlyStem || '-'}</div>
                    <div className="branch">{data.dayPillar.earthlyBranch || '-'}</div>
                  </div>
                </div>
              )}
              {data.hourPillar && (
                <div className="pillar">
                  <h3>시주 (時柱)</h3>
                  <div className="pillar-content">
                    <div className="stem">{data.hourPillar.heavenlyStem || '-'}</div>
                    <div className="branch">{data.hourPillar.earthlyBranch || '-'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="result-section">
            <h2>전체 데이터 (JSON)</h2>
            <pre className="json-data">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default SajuResult;
