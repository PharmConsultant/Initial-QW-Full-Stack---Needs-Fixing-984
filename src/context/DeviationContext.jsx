import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AuditTrailService from '../components/AuditTrail/AuditTrailService';

const DeviationContext = createContext();

const initialState = {
  currentDeviation: null,
  deviations: [],
  currentStep: 0,
  formData: {
    basicInfo: {},
    riskAssessment: {},
    problemStatement: {},
    rootCause: {},
    containment: {},
    capa: {},
    trending: {}
  }
};

function deviationReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_DEVIATION':
      // Log view activity
      if (action.payload?.id) {
        AuditTrailService.logView(action.payload.id, 'Full Investigation');
      }
      return {
        ...state,
        currentDeviation: action.payload
      };

    case 'UPDATE_FORM_DATA':
      const { section, payload, oldData } = action;
      
      // Log field updates with audit trail
      if (oldData && payload) {
        Object.keys(payload).forEach(field => {
          if (oldData[field] !== payload[field]) {
            AuditTrailService.logFieldUpdate(
              state.currentDeviation?.id,
              section,
              field,
              oldData[field],
              payload[field],
              `Updated ${field} in ${section} section`
            );
          }
        });
      }

      return {
        ...state,
        formData: {
          ...state.formData,
          [section]: {
            ...state.formData[section],
            ...payload
          }
        }
      };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      };

    case 'SAVE_DEVIATION':
      const deviation = {
        id: action.payload.id || uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingIndex = state.deviations.findIndex(d => d.id === deviation.id);
      const updatedDeviations = existingIndex >= 0
        ? state.deviations.map((d, i) => i === existingIndex ? deviation : d)
        : [...state.deviations, deviation];

      // Log deviation creation or update
      if (existingIndex < 0) {
        AuditTrailService.logDeviationCreated(deviation.id, deviation);
      } else {
        AuditTrailService.logActivity({
          action: 'Deviation Updated',
          actionType: 'UPDATE',
          deviationId: deviation.id,
          section: 'Full Investigation',
          justification: 'Investigation data updated',
          regulatoryImpact: 'Medium'
        });
      }

      return {
        ...state,
        deviations: updatedDeviations,
        currentDeviation: deviation
      };

    case 'LOG_AI_GENERATION':
      AuditTrailService.logAIGeneration(
        action.payload.deviationId,
        action.payload.section,
        action.payload.aiModel,
        action.payload.generatedContent,
        action.payload.justification
      );
      return state;

    case 'LOG_APPROVAL':
      AuditTrailService.logApproval(
        action.payload.deviationId,
        action.payload.approvalLevel,
        action.payload.comments,
        action.payload.electronicSignature
      );
      return state;

    case 'LOG_STATUS_CHANGE':
      AuditTrailService.logStatusChange(
        action.payload.deviationId,
        action.payload.oldStatus,
        action.payload.newStatus,
        action.payload.justification
      );
      return state;

    case 'RESET_FORM':
      return {
        ...state,
        currentDeviation: null,
        currentStep: 0,
        formData: initialState.formData
      };

    default:
      return state;
  }
}

export function DeviationProvider({ children }) {
  const [state, dispatch] = useReducer(deviationReducer, initialState);

  const value = {
    ...state,
    dispatch,
    updateFormData: (section, data) => {
      const oldData = state.formData[section];
      dispatch({ 
        type: 'UPDATE_FORM_DATA', 
        section, 
        payload: data,
        oldData 
      });
    },
    setCurrentStep: (step) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    saveDeviation: (data) => dispatch({ type: 'SAVE_DEVIATION', payload: data }),
    resetForm: () => dispatch({ type: 'RESET_FORM' }),
    logAIGeneration: (payload) => dispatch({ type: 'LOG_AI_GENERATION', payload }),
    logApproval: (payload) => dispatch({ type: 'LOG_APPROVAL', payload }),
    logStatusChange: (payload) => dispatch({ type: 'LOG_STATUS_CHANGE', payload }),
    setCurrentDeviation: (deviation) => dispatch({ type: 'SET_CURRENT_DEVIATION', payload: deviation })
  };

  return (
    <DeviationContext.Provider value={value}>
      {children}
    </DeviationContext.Provider>
  );
}

export function useDeviation() {
  const context = useContext(DeviationContext);
  if (!context) {
    throw new Error('useDeviation must be used within a DeviationProvider');
  }
  return context;
}