from typing import Dict, Any
from backend.data_services.mongo.user_repository import get_user_by_id
from backend.data_services.mongo.assistant_repository import get_assistant_by_id

def build_personalized_prompt(user_id: str, assistant_id: str = None) -> str:
    """
    Build a personalized system prompt incorporating user information and assistant configuration.
    
    Args:
        user_id: The user's ID
        assistant_id: Optional assistant ID for specific assistant configuration
    
    Returns:
        str: Personalized system prompt
    """
    # Get user information
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError(f"User {user_id} not found")
    
    # Get assistant configuration if provided
    assistant_config = None
    if assistant_id:
        assistant_config = get_assistant_by_id(assistant_id)
        if not assistant_config:
            raise ValueError(f"Assistant {assistant_id} not found")
    
    # Extract user information from resume
    resume = user.get('resume', {})
    user_info = {
        "name": f"{resume.get('first_name', '')} {resume.get('last_name', '')}".strip(),
        "summary": resume.get('summary', ''),
        "skills": resume.get('skills', []),
        "work_experience": resume.get('work_experience', []),
        "education": resume.get('education', []),
        "languages": resume.get('languages', []),
        "links": resume.get('links', []),
        "phone": resume.get('phone', '')
    }
    
    # Build the personalized prompt
    prompt = f"""You are  {assistant_config.get('name', 'AI Assistant')}, a personal assistant for {user_info['name']}. You have deep knowledge about them and their background.

PERSONAL INFORMATION:
- Name: {user_info['name']}
- Contact: {user_info['phone']}
- Professional Links: {', '.join(user_info['links'])}

PROFESSIONAL SUMMARY:
{user_info['summary']}

WORK EXPERIENCE:
{format_work_experience(user_info['work_experience'])}

EDUCATION:
{format_education(user_info['education'])}

SKILLS:
{format_skills(user_info['skills'])}

LANGUAGES:
{', '.join(user_info['languages'])}

YOUR ROLE:
1. You are their personal assistant, 
2. 
3. Maintain a professional yet friendly tone
5. Respect their privacy and professional boundaries
6. When unsure, ask for clarification rather than making assumptions

IMPORTANT:
- Always maintain professional confidentiality
- Never share sensitive personal information
- Confirm before taking actions on their behalf"""

    # Add assistant-specific configuration if provided
    if assistant_config:
        prompt += f"""

ASSISTANT CONFIGURATION:
- Name: {assistant_config.get('name', 'AI Assistant')}
- Type: {assistant_config.get('type', 'General')}
- Responsibilities: {', '.join(assistant_config.get('responsibilities', ['General assistance']))}
- Additional Instructions: {assistant_config.get('instructions', '')}"""

    return prompt

def format_work_experience(work_experience: list) -> str:
    """Format work experience entries into a readable string."""
    if not work_experience:
        return "No work experience information available"
    
    formatted = []
    for exp in work_experience:
        if not isinstance(exp, dict):
            continue
            
        entry = []
        if exp.get('title'):
            entry.append(exp['title'])
        if exp.get('company'):
            entry.append(f"at {exp['company']}")
            
        if entry:
            formatted_entry = " - ".join(entry)
            if exp.get('start_date'):
                end_date = exp.get('end_date', 'Present')
                formatted_entry += f" ({exp['start_date']} - {end_date})"
            if exp.get('description'):
                formatted_entry += f"\n  {exp['description']}"
            formatted.append(formatted_entry)
    
    return '\n'.join(formatted) if formatted else "No work experience information available"

def format_education(education: list) -> str:
    """Format education entries into a readable string."""
    if not education:
        return "No education information available"
    
    formatted = []
    for edu in education:
        if not isinstance(edu, dict):
            continue
            
        entry = []
        if edu.get('degree'):
            entry.append(edu['degree'])
        if edu.get('field'):
            entry.append(f"in {edu['field']}")
        if edu.get('institution'):
            entry.append(f"from {edu['institution']}")
            
        if entry:
            formatted_entry = " ".join(entry)
            if edu.get('graduation_date'):
                formatted_entry += f" ({edu['graduation_date']})"
            formatted.append(formatted_entry)
    
    return '\n'.join(formatted) if formatted else "No education information available"

def format_skills(skills: list) -> str:
    """Format skills into a readable string."""
    if not skills:
        return "No skills information available"
    
    formatted = []
    for skill in skills:
        if isinstance(skill, dict):
            if skill.get('name'):
                formatted.append(skill['name'])
        elif isinstance(skill, str):
            formatted.append(skill)
    
    return ', '.join(formatted) if formatted else "No skills information available" 