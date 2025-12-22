export const formatResponse = (data, intent) => {
    if (!data) return "I'm sorry, I couldn't find detailed information on that.";

    // 1. Direct String
    if (typeof data === 'string') return data;

    // 2. Handling specific intents for custom formatting
    if (intent === 'greeting' || intent === 'farewell' || intent === 'gratitude') {
        return formatCommunication(data);
    }

    // 3. Generic Array Handling
    if (Array.isArray(data)) {
        return data.map(item => formatItem(item)).join('\n\n');
    }

    // 4. Generic Object Handling
    return formatObject(data);
};

const formatCommunication = (data) => {
    let output = `${data.message}\n\n`;
    if (data.quickAccess) {
        output += "**Quick Access**:\n" + data.quickAccess.map(qa => `• ${qa}`).join('\n');
    }
    if (data.recap) {
        output += "**Quick Recap**:\n" + data.recap.map(r => `• ${r}`).join('\n');
    }
    if (data.nextSteps) {
        output += "**Next Steps**:\n" + data.nextSteps.map(n => `• ${n}`).join('\n');
    }
    return output;
};

const formatItem = (item) => {
    if (typeof item === 'string') return `• ${item}`;

    // Specific Object formatting (Project, Package, etc.)
    let title = item.name || item.type || item.supportType || item.category || "Item";
    let output = `**${title}**\n`;

    Object.entries(item).forEach(([key, val]) => {
        if (['name', 'type', 'supportType', 'category', 'items'].includes(key)) return; // Skip title keys

        // Skip empty values
        if (!val) return;

        const label = camelToTitle(key);

        if (Array.isArray(val)) {
            output += `• **${label}**: ${val.join(', ')}\n`;
        } else if (typeof val === 'object') {
            // Nested simple object
            output += `• **${label}**: ${JSON.stringify(val).replace(/["{}]/g, '').replace(/:/g, ': ')}\n`;
        } else {
            output += `• **${label}**: ${val}\n`;
        }
    });

    // Handle 'items' list inside a category (e.g. Services)
    if (item.items && Array.isArray(item.items)) {
        output += item.items.map(i => `• ${i}`).join('\n') + '\n';
    }

    return output;
};

const formatObject = (obj) => {
    let output = "";

    Object.entries(obj).forEach(([key, val]) => {
        const label = camelToTitle(key);

        output += `**${label}**\n`;

        if (Array.isArray(val)) {
            output += val.map(v => {
                if (typeof v === 'string') return `• ${v}`;
                return formatItem(v); // Recursive for objects in array
            }).join('\n');
        } else if (typeof val === 'object' && val !== null) {
            if (key === 'address') {
                // Special handling for address
                const addr = Object.values(val).join(', ');
                output += `${addr}\n`;
            } else {
                output += formatObject(val); // Recursive
            }
        } else {
            output += `${val}\n`;
        }
        output += "\n";
    });

    return output;
};

const camelToTitle = (camelCase) => {
    const result = camelCase.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
};
