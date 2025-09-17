export type Application = {
  program_type?: string; // e.g. "Postgraduate Diploma/Taught Masters" or "Foundation"
  user_program?: string; // e.g. "postgraduate"
  referee_1?: boolean | null;
  referee_2?: boolean | null;
  uuid?: string;
  user_full_name?: string;
};

export function isPostgraduateOrFoundation(app: Application): boolean {
  const program = (app.user_program || '').toLowerCase();
  const type = (app.program_type || '').toLowerCase();

  return (
    program.includes('postgraduate') ||
    type.includes('postgraduate') ||
    program.includes('foundation') ||
    type.includes('foundation') ||
    type.includes('remedial')
  );
}

export type ApplicationStatus = 'Awaiting referee' | 'Ready for review' | 'Unknown';

export function getApplicationStatus(app: Application): ApplicationStatus {
  const refereeOneCompleted = app.referee_1 === true;
  const refereeTwoCompleted = app.referee_2 === true;

  if (!refereeOneCompleted || !refereeTwoCompleted) return 'Awaiting referee';
  return 'Ready for review';
}

export function shouldShowActionButtons(app: Application): boolean {
  return getApplicationStatus(app) !== 'Awaiting referee';
}


