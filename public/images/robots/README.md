# Robot Images Directory

This directory contains images and 3D models for the robots displayed in the dashboard.

## File Structure

Place your robot images here with the following naming convention:

- **Arm Robot**: `arm-robot.png` (or `.jpg`, `.webp`, etc.)
- **Pepper Robot**: `pepper-robot.png`
- **Dog Robot**: `dog-robot.png`

## Optional 3D Models

For 3D models (GLB/GLTF format), use:
- `arm-robot-3d.glb`
- `pepper-robot-3d.glb`
- `dog-robot-3d.glb`

## Image Requirements

- **Recommended size**: 400x400px or larger (square aspect ratio preferred)
- **Format**: PNG (with transparency), JPG, or WebP
- **Background**: Transparent or matching the card background
- **Style**: 3D render, icon, or illustration that matches the Dark Modern Tech aesthetic

## Usage

The images are automatically loaded from the robot configuration in `config/robots.js`. If an image is not found, the system will fall back to the emoji icon.

