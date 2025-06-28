import { useCallback } from 'react';
import AuditTrailService from '../components/AuditTrail/AuditTrailService';

export const useAuditTrail = (deviationId) => {
  const logActivity = useCallback((params) => {
    return AuditTrailService.logActivity({
      ...params,
      deviationId
    });
  }, [deviationId]);

  const logFieldUpdate = useCallback((section, fieldChanged, oldValue, newValue, justification) => {
    return AuditTrailService.logFieldUpdate(
      deviationId,
      section,
      fieldChanged,
      oldValue,
      newValue,
      justification
    );
  }, [deviationId]);

  const logAIGeneration = useCallback((section, aiModel, generatedContent, justification) => {
    return AuditTrailService.logAIGeneration(
      deviationId,
      section,
      aiModel,
      generatedContent,
      justification
    );
  }, [deviationId]);

  const logApproval = useCallback((approvalLevel, comments, electronicSignature) => {
    return AuditTrailService.logApproval(
      deviationId,
      approvalLevel,
      comments,
      electronicSignature
    );
  }, [deviationId]);

  const logView = useCallback((section) => {
    return AuditTrailService.logView(deviationId, section);
  }, [deviationId]);

  const logStatusChange = useCallback((oldStatus, newStatus, justification) => {
    return AuditTrailService.logStatusChange(
      deviationId,
      oldStatus,
      newStatus,
      justification
    );
  }, [deviationId]);

  const logCAPAAction = useCallback((capaAction, justification) => {
    return AuditTrailService.logCAPAAction(
      deviationId,
      capaAction,
      justification
    );
  }, [deviationId]);

  const getAuditTrail = useCallback(() => {
    return AuditTrailService.getAuditTrail(deviationId);
  }, [deviationId]);

  const exportAuditTrail = useCallback((format = 'json') => {
    return AuditTrailService.exportAuditTrail(deviationId, format);
  }, [deviationId]);

  return {
    logActivity,
    logFieldUpdate,
    logAIGeneration,
    logApproval,
    logView,
    logStatusChange,
    logCAPAAction,
    getAuditTrail,
    exportAuditTrail
  };
};