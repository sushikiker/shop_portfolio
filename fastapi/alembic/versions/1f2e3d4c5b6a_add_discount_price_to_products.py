"""add discount_price to Products

Revision ID: 1f2e3d4c5b6a
Revises: caa2e44bd377
Create Date: 2026-05-03 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1f2e3d4c5b6a'
down_revision: Union[str, Sequence[str], None] = 'caa2e44bd377'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('Products', sa.Column('discount_price', sa.Float(), nullable=True))
    op.alter_column('Products', 'price', type_=sa.Float(), existing_type=sa.Integer())


def downgrade() -> None:
    op.alter_column('Products', 'price', type_=sa.Integer(), existing_type=sa.Float())
    op.drop_column('Products', 'discount_price')
