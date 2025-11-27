pragma solidity ^0.8.20;

interface IUniswapV2ERC20 {
    function name() external view returns (string memory);        // pure → view
    function symbol() external view returns (string memory);      // pure → view
    function decimals() external view returns (uint8);            // pure → view
    function totalSupply() external view returns (uint);          // pure → view
    function balanceOf(address owner) external view returns (uint);  // pure → view
    function allowance(address owner, address spender) external view returns (uint);  // pure → view

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    // Permit-related: Đổi từ pure → view
    function DOMAIN_SEPARATOR() external view returns (bytes32);  // pure → view
    function PERMIT_TYPEHASH() external view returns (bytes32);   // pure → view
    function nonces(address owner) external view returns (uint);  // pure → view

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);
}