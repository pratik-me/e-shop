"use client";

import styled from "styled-components";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    $styles?: React.CSSProperties;
}

const StyledBox = styled.div`
    box-sizing: border-box;
`;

export const Box = ({ $styles, ...props }: BoxProps) => (
    <StyledBox style={$styles} {...props} />
);


/*
* Key Takeaway for Styled Components + TS
! Transient Props ($): Always use these for props that are only meant for your styles and shouldn't be passed to the DOM.

! Avoid css as a prop name: It is a reserved keyword for the "CSS Prop" feature in Styled Components/Emotion and will almost always cause typing conflicts.
*/