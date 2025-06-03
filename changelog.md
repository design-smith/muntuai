# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Added support for multiple search methods in search agent
- Added proper handling of Node objects in search agent
- Added debug logging for search agent operations
- Added better error handling for JSON parsing in search agent
- Added support for nested data structures in search results
- Added proper handling of Node labels and properties
- Added better formatting for search results
- Added support for both object and dictionary formats in search agent
- Added explicit instructions for comprehensive data search
- Added better error tracking and debugging capabilities

### Changed
- Improved search agent's data extraction capabilities
- Enhanced property extraction from Node objects
- Updated search agent to handle both Node objects and dictionaries
- Improved formatting of search results
- Enhanced error handling in search agent
- Updated search instructions to be more comprehensive
- Improved debug logging for better troubleshooting
- Enhanced handling of nested data structures
- Updated property access methods for better reliability
- Improved JSON response cleaning and parsing

### Fixed
- Fixed Node object property access in search agent
- Fixed handling of nested data structures
- Fixed JSON parsing errors in search agent
- Fixed property extraction from Node objects
- Fixed handling of Node labels
- Fixed formatting of search results
- Fixed error handling in search agent
- Fixed data extraction from Node objects
- Fixed handling of both object and dictionary formats
- Fixed debug logging for better error tracking

## [0.1.0] - 2024-03-26

### Added
- Initial project setup
- Basic project structure
- Core functionality implementation
- Basic documentation
- Initial test suite
- Basic error handling
- Initial logging setup
- Basic configuration management
- Initial deployment setup
- Basic security measures

### Changed
- Updated project structure
- Enhanced documentation
- Improved error handling
- Updated logging configuration
- Enhanced security measures
- Improved configuration management
- Updated deployment process
- Enhanced test coverage
- Improved code organization
- Updated development workflow

### Fixed
- Fixed initial setup issues
- Fixed documentation errors
- Fixed configuration problems
- Fixed deployment issues
- Fixed security vulnerabilities
- Fixed logging configuration
- Fixed test suite issues
- Fixed code organization
- Fixed development workflow
- Fixed project structure

## Frontend Changes
- Added default route redirect to dashboard page
- Changed onboarding flow to use isFirstLogin instead of onboardingCompleted flag

## Backend Changes
- Updated CORS configuration to allow all origins during development
- Documented GraphRAG architecture and integration with AI assistant
- Documented AI assistant architecture and request handling flow
- Added user-specific database access for AI assistant with caching
- Implemented three-source context system (GraphRAG, Database, Chat History)
- Fixed MongoDB client integration to use existing implementation
- Improved AI assistant context formatting with structured data presentation
- Enhanced primary agent with better context organization and explicit instructions
- Fixed assistant data service file location and import paths
- Fixed user ID handling to properly use MongoDB _id for data retrieval
- Improved context prioritization and empty GraphRAG result handling
- Made context handling more dynamic with AI-driven source selection
- Added direct resume data extraction from user document
- Enhanced user ID handling with ObjectId conversion and fallback lookups
- Improved resume data extraction to include all resume-related fields
- Added better error handling and debug logging for user data retrieval
- Implemented structured and raw text resume formatting options 