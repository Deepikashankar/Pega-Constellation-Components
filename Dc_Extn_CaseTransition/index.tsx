import { useEffect, useMemo, useState } from 'react';
import type { PConnFieldProps } from './PConnProps';
import { withConfiguration } from '@pega/cosmos-react-core';

interface DCaseTransitionViewerProps extends PConnFieldProps {}

type ProcessItem = {
  pxIsComplete?: string;
  pxCompletedBy?: string;
  pyFlowName?: string;
};

type StageItem = {
  pyStageName?: string;
  pxProcesses?: ProcessItem[];
};

type CaseTransitionItem = {
  pyID?: string;
  pyLabel?: string;
  pyStages?: StageItem[];
};

function StatusIcon({ status }: { status: 'completed' | 'started' | 'empty' }) {
  if (status === 'completed') {
    return (
      <span title="Completed" style={{ display: 'inline-flex', alignItems: 'center', color: '#2e7d32' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#2e7d32" strokeWidth="1.5" fill="#e8f5e9" />
          <path d="M7 13l2.5 2.5L17 8" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  if (status === 'started') {
    // Blue circle with arrow for \"pending started\" processes
    return (
      <span title="Started" style={{ display: 'inline-flex', alignItems: 'center', color: '#1e88e5' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#1e88e5" strokeWidth="1.6" fill="#e3f2fd" />
          <path d="M9 8l3 3-3 3" stroke="#1e88e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  // empty circle (no started processes)
  return (
    <span title="Pending" style={{ display: 'inline-flex', alignItems: 'center', color: '#bdbdbd' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#bdbdbd" strokeWidth="1.2" fill="#fff" />
      </svg>
    </span>
  );
}

function Triangle({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      style={{ transform: open ? 'rotate(180deg)' : 'none', marginRight: 6 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 10l5 5 5-5H7z" fill="#555" />
    </svg>
  );
}

function DCaseTransitionViewer(props: DCaseTransitionViewerProps) {
  const { getPConnect } = props;
  const pConn = getPConnect();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dpageResponse, setDpageResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const constants = PCore.getConstants();
  const caseId: string | undefined = pConn.getValue(constants.CASE_INFO.CASE_INFO_ID) ?? undefined;

  const parameters = useMemo(() => (caseId ? { ID: caseId } : undefined), [caseId]);
  const serializedParams = useMemo(() => JSON.stringify(parameters ?? {}), [parameters]);

  const context = pConn.getContextName();
  const dataPageName = 'D_CaseTransition';

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    setDpageResponse(null);

    if (!caseId) {
      if (mounted) {
        setError('Case ID not available from CASE_INFO.CASE_INFO_ID.');
        setIsLoading(false);
      }
      return () => {
        mounted = false;
      };
    }

    try {
      PCore.getDataPageUtils()
        .getPageDataAsync(dataPageName, context, parameters)
        .then((res: any) => {
          if (!mounted) return;
          setDpageResponse(res ?? null);
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          if (!mounted) return;
          const errMsg =
            err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string'
              ? (err as any).message
              : String(err);
          setError(errMsg);
          setIsLoading(false);
        });
    } catch (err: unknown) {
      if (!mounted) return;
      const errMsg =
        err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string'
          ? (err as any).message
          : String(err);
      setError(errMsg);
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [dataPageName, context, parameters, serializedParams, caseId]);

  const caseTransitionArray: CaseTransitionItem[] = dpageResponse?.CaseTransition ?? [];

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toggleOpen = (i: number) => setOpenIdx((prev) => (prev === i ? null : i));

  // compute status per stage: completed | started (some process pxIsComplete === 'Started' OR 'Pending-Started') | empty (no Started)
  const computeStageStatus = (stage: StageItem): 'completed' | 'started' | 'empty' => {
    const processes = stage.pxProcesses ?? [];
    if (processes.length === 0) return 'empty';

    // treat these values as "started"
    const STARTED_VALUES = new Set(['Started', 'Pending-Started', 'Pending-Started ']); // include possible variants
    const completed = processes.filter((p) => p.pxIsComplete === 'Completed').length;
    const started = processes.filter((p) => p.pxIsComplete && STARTED_VALUES.has(p.pxIsComplete)).length;

    if (completed === processes.length) return 'completed';
    if (started > 0) return 'started';
    return 'empty';
  };

  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', padding: 12 }}>
      {/* header row: Request ID | Request Type */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ flex: '0 0 220px' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Request ID</div>
          <div style={{ fontWeight: 600 }}>{caseTransitionArray[0]?.pyID ?? caseId ?? '—'}</div>
        </div>

        <div style={{ flex: '1 1 480px' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Request Type</div>
          <div style={{ fontWeight: 600 }}>{caseTransitionArray[0]?.pyLabel ?? '—'}</div>
        </div>
      </div>

      {isLoading && <div>{pConn.getLocalizedValue('Loading...', '', '')}</div>}

      {!isLoading && error && (
        <div style={{ color: 'var(--pega-danger, #c92b2b)', whiteSpace: 'pre-wrap' }}>
          <strong>Error:</strong>
          <div>{error}</div>
        </div>
      )}

      {!isLoading && !error && caseTransitionArray.length === 0 && (
        <div>{pConn.getLocalizedValue('No CaseTransition data available', '', '')}</div>
      )}

      {!isLoading && !error && caseTransitionArray.length > 0 && (
        <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
          {caseTransitionArray.map((ct: CaseTransitionItem) => {
            const stages = ct.pyStages ?? [];
            const ctKey = ct.pyID ?? JSON.stringify(ct).slice(0, 10);
            return (
              <div key={ctKey} style={{ marginBottom: 12 }}>
                {stages.map((stage: StageItem, sidx: number) => {
                  const status = computeStageStatus(stage);
                  const numericIdx = Number(`${ctKey.replace(/\D/g, '') || 0}`) * 1000 + sidx;

                  return (
                    <div key={`${ctKey}-${stage.pyStageName ?? sidx}`} style={{ padding: '8px 0', borderBottom: '1px solid #f2f2f2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleOpen(numericIdx)}
                            aria-expanded={openIdx === numericIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: 6,
                              marginRight: 8,
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                            }}
                          >
                            <Triangle open={openIdx === numericIdx} />
                          </button>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <StatusIcon status={status} />
                            <div style={{ fontWeight: 600 }}>{stage.pyStageName ?? 'Unnamed stage'}</div>
                          </div>
                        </div>

                        <div style={{ color: '#777', fontSize: 13 }}>
                          {status === 'completed' && <span>Completed</span>}
                          {status === 'started' && <span>Started</span>}
                          {status === 'empty' && <span />}
                        </div>
                      </div>

                      {openIdx === numericIdx && (
                        <div style={{ marginTop: 10, paddingLeft: 34 }}>
                          {(stage.pxProcesses ?? []).map((proc: ProcessItem, pidx: number) => {
                            const procKey = `${ctKey}-${stage.pyStageName ?? sidx}-${proc.pyFlowName ?? pidx}`;
                            const done = proc.pxIsComplete === 'Completed';
                            return (
                              <div
                                key={procKey}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div style={{ width: 18 }}>
                                    {done ? (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12l2 2 4-4" stroke="#2e7d32" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ) : (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="8" cy="8" r="6" stroke="#bdbdbd" strokeWidth="1.2" fill="#fff" />
                                      </svg>
                                    )}
                                  </div>

                                  <div style={{ fontWeight: 600 }}>{proc.pyFlowName ?? 'Unnamed process'}</div>
                                </div>

                                <div style={{ color: '#666', fontSize: 13, textAlign: 'right' }}>
                                  {done ? <div>Completed by {proc.pxCompletedBy ?? '—'}</div> : <div>Not completed</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default withConfiguration(DCaseTransitionViewer);
