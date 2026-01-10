export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // New feature
                'fix',      // Bug fix
                'docs',     // Documentation
                'style',    // Formatting, missing semicolons, etc.
                'refactor', // Code restructuring without changing behavior
                'perf',     // Performance improvements
                'test',     // Adding or updating tests
                'build',    // Build system or dependencies
                'ci',       // CI configuration
                'chore',    // Maintenance tasks
                'revert',   // Reverting changes
            ],
        ],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-empty': [2, 'never'],
        'type-empty': [2, 'never'],
    },
}
