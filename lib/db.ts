
import { sql } from '@vercel/postgres';

// Ensure the connection is cached if needed, but Vercel handles this well.

// --- Profile ---
export async function getProfile() {
    try {
        const { rows } = await sql`SELECT * FROM profile LIMIT 1`;
        return rows[0] || {};
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch profile data.');
    }
}

export async function updateProfile(data: any) {
    try {
        // Check if profile exists
        const { rows } = await sql`SELECT id FROM profile LIMIT 1`;

        if (rows.length === 0) {
            await sql`
        INSERT INTO profile (name, title, subtitle, status, image_url)
        VALUES (${data.name}, ${data.title}, ${data.subtitle}, ${data.status}, ${data.image_url})
      `;
        } else {
            await sql`
        UPDATE profile 
        SET name = ${data.name}, title = ${data.title}, subtitle = ${data.subtitle}, status = ${data.status}, image_url = ${data.image_url}
        WHERE id = ${rows[0].id}
      `;
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update profile.');
    }
}

// --- Projects ---
export async function getProjects() {
    try {
        const { rows } = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch projects.');
    }
}

export async function addProject(data: any) {
    try {
        const technologies = Array.isArray(data.technologies) ? data.technologies : [];
        await sql`
      INSERT INTO projects (title, description, technologies, category, image_url, github_link)
      VALUES (${data.title}, ${data.description}, ${technologies}, ${data.category}, ${data.image_url}, ${data.github_link})
    `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to add project.');
    }
}

export async function updateProject(id: number, data: any) {
    try {
        const technologies = Array.isArray(data.technologies) ? data.technologies : [];
        await sql`
      UPDATE projects 
      SET title = ${data.title}, description = ${data.description}, technologies = ${technologies}, category = ${data.category}, image_url = ${data.image_url}, github_link = ${data.github_link}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update project.');
    }
}

export async function deleteProject(id: number) {
    try {
        await sql`DELETE FROM projects WHERE id = ${id}`;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete project.');
    }
}

// --- Education ---
export async function getEducation() {
    try {
        const { rows } = await sql`SELECT * FROM education ORDER BY display_order ASC, id DESC`;
        return rows;
    } catch (error) {
        throw new Error('Failed to fetch education.');
    }
}

export async function addEducation(data: any) {
    try {
        await sql`
      INSERT INTO education (school, degree, year, display_order)
      VALUES (${data.school}, ${data.degree}, ${data.year}, ${data.display_order || 0})
    `;
    } catch (error) {
        throw new Error('Failed to add education.');
    }
}

export async function updateEducation(id: number, data: any) {
    try {
        await sql`
      UPDATE education 
      SET school = ${data.school}, degree = ${data.degree}, year = ${data.year}, display_order = ${data.display_order || 0}
      WHERE id = ${id}
    `;
    } catch (error) {
        throw new Error('Failed to update education.');
    }
}

export async function deleteEducation(id: number) {
    try {
        await sql`DELETE FROM education WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Failed to delete education.');
    }
}

// --- Experiences ---
export async function getExperiences() {
    try {
        const { rows } = await sql`SELECT * FROM experiences ORDER BY display_order ASC, id DESC`;
        return rows;
    } catch (error) {
        throw new Error('Failed to fetch experiences.');
    }
}

export async function addExperience(data: any) {
    try {
        const description = Array.isArray(data.description) ? data.description : [];
        await sql`
      INSERT INTO experiences (company, role, period, description, display_order)
      VALUES (${data.company}, ${data.role}, ${data.period}, ${description}, ${data.display_order || 0})
    `;
    } catch (error) {
        throw new Error('Failed to add experience.');
    }
}

export async function updateExperience(id: number, data: any) {
    try {
        const description = Array.isArray(data.description) ? data.description : [];
        await sql`
      UPDATE experiences 
      SET company = ${data.company}, role = ${data.role}, period = ${data.period}, description = ${description}, display_order = ${data.display_order || 0}
      WHERE id = ${id}
    `;
    } catch (error) {
        throw new Error('Failed to update experience.');
    }
}

export async function deleteExperience(id: number) {
    try {
        await sql`DELETE FROM experiences WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Failed to delete experience.');
    }
}

// --- Skills ---
export async function getSkills() {
    try {
        const { rows } = await sql`SELECT * FROM skills ORDER BY id ASC`;
        return rows;
    } catch (error) {
        throw new Error('Failed to fetch skills.');
    }
}

export async function addSkill(data: any) {
    try {
        await sql`
      INSERT INTO skills (name, level, category)
      VALUES (${data.name}, ${data.level || 50}, ${data.category})
    `;
    } catch (error) {
        throw new Error('Failed to add skill.');
    }
}

export async function updateSkill(id: number, data: any) {
    try {
        await sql`
      UPDATE skills 
      SET name = ${data.name}, level = ${data.level || 50}, category = ${data.category}
      WHERE id = ${id}
    `;
    } catch (error) {
        throw new Error('Failed to update skill.');
    }
}

export async function deleteSkill(id: number) {
    try {
        await sql`DELETE FROM skills WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Failed to delete skill.');
    }
}

// --- Languages ---
export async function getLanguages() {
    try {
        const { rows } = await sql`SELECT * FROM languages ORDER BY display_order ASC, id ASC`;
        return rows;
    } catch (error) {
        throw new Error('Failed to fetch languages.');
    }
}

export async function addLanguage(data: any) {
    try {
        await sql`
      INSERT INTO languages (name, level, display_order)
      VALUES (${data.name}, ${data.level}, ${data.display_order || 0})
    `;
    } catch (error) {
        throw new Error('Failed to add language.');
    }
}

export async function updateLanguage(id: number, data: any) {
    try {
        await sql`
      UPDATE languages 
      SET name = ${data.name}, level = ${data.level}, display_order = ${data.display_order || 0}
      WHERE id = ${id}
    `;
    } catch (error) {
        throw new Error('Failed to update language.');
    }
}

export async function deleteLanguage(id: number) {
    try {
        await sql`DELETE FROM languages WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Failed to delete language.');
    }
}

// --- Interests ---
export async function getInterests() {
    try {
        const { rows } = await sql`SELECT * FROM interests ORDER BY display_order ASC, id ASC`;
        return rows;
    } catch (error) {
        throw new Error('Failed to fetch interests.');
    }
}

export async function addInterest(data: any) {
    try {
        await sql`
      INSERT INTO interests (name, display_order)
      VALUES (${data.name}, ${data.display_order || 0})
    `;
    } catch (error) {
        throw new Error('Failed to add interest.');
    }
}

export async function updateInterest(id: number, data: any) {
    try {
        await sql`
      UPDATE interests 
      SET name = ${data.name}, display_order = ${data.display_order || 0}
      WHERE id = ${id}
    `;
    } catch (error) {
        throw new Error('Failed to update interest.');
    }
}

export async function deleteInterest(id: number) {
    try {
        await sql`DELETE FROM interests WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Failed to delete interest.');
    }
}

// --- Messages ---
export async function getMessages() {
    try {
        const { rows } = await sql`SELECT * FROM messages ORDER BY created_at DESC`;
        return rows;
    } catch (error) {
        throw new Error('Failed to fetch messages.');
    }
}

export async function addMessage(data: any) {
    try {
        await sql`
      INSERT INTO messages (name, email, message)
      VALUES (${data.name}, ${data.email}, ${data.message})
    `;
    } catch (error) {
        throw new Error('Failed to add message.');
    }
}

export async function deleteMessage(id: number) {
    try {
        await sql`DELETE FROM messages WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Failed to delete message.');
    }
}

export async function updateMessage(id: number, is_read: boolean) {
    try {
        await sql`UPDATE messages SET is_read = ${is_read} WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Failed to update message.');
    }
}


// --- Auth ---
export async function getAdminUser(email: string) {
    try {
        const { rows } = await sql`SELECT * FROM admin_users WHERE email = ${email} LIMIT 1`;
        return rows[0];
    } catch (error) {
        throw new Error('Failed to fetch user.');
    }
}
