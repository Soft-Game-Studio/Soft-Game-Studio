import companyData from '../data/knowledge/company.json';
import projectsData from '../data/knowledge/projects.json';
import servicesData from '../data/knowledge/services.json';
import contactData from '../data/knowledge/contact.json';
import educationData from '../data/knowledge/education.json';
import examData from '../data/knowledge/exam.json';
import legalData from '../data/knowledge/legal.json';
import technologyData from '../data/knowledge/technology.json';
import communicationData from '../data/knowledge/communication.json';

const domains = {
    company: companyData,
    projects: projectsData,
    services: servicesData,
    contact: contactData,
    education: educationData,
    exam: examData,
    legal: legalData,
    technology: technologyData,
    communication: communicationData
};

export const resolveData = (sourcePath) => {
    if (!sourcePath) return null;

    // sourcePath e.g., "company.list.leadership"
    const parts = sourcePath.split('.');
    const domain = parts[0];

    if (!domains[domain]) {
        console.warn(`Domain '${domain}' not found in resolver.`);
        return null;
    }

    let current = domains[domain];
    for (let i = 1; i < parts.length; i++) {
        if (current && current[parts[i]] !== undefined) {
            current = current[parts[i]];
        } else {
            console.warn(`Path '${sourcePath}' failed at '${parts[i]}'`);
            return null;
        }
    }

    return current;
};
