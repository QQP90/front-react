describe('admin flow', () => {
  it('login dashboard and users crud entry', () => {
    cy.visit('/login')
    cy.get('input').first().clear().type('admin')
    cy.get('input[type="password"]').clear().type('Admin123!')
    cy.get('input').eq(2).clear().type('1234')
    cy.contains('button', '登录').click()
    cy.contains('访问趋势')
    cy.contains('用户管理').click()
    cy.contains('新增').click()
    cy.contains('新增用户')
  })
})
