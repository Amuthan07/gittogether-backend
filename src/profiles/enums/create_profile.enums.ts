export enum ProfileMode{
    DATING = 'dating',
    NETWORKING = 'networking',
    PROJECTS = 'projects'
}

/**
 * ProfileRole - Developer/Technical Role
 * This is NOT the same as UserRole (user/admin)!
 * This describes what kind of developer the person is
 */
export enum ProfileRole{
    FRONTEND = 'frontend',
    BACKEND = 'backend',
    FULLSTACK = 'fullstack',
    QA = 'qa',
    DEVOPS = 'devops',
    DATA = 'data',
}

export enum ExperienceLevel {
  STUDENT = 'student',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
}