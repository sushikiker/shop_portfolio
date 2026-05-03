"""change img to image_path in Products

Revision ID: 3a4b5c6d7e8f
Revises: 22eec44fce06
Create Date: 2026-05-03 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '3a4b5c6d7e8f'
down_revision: Union[str, Sequence[str], None] = '22eec44fce06'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.alter_column('Products', 'img', new_column_name='image_path', type_=sa.String(length=255), existing_type=sa.String(length=100))

def downgrade() -> None:
    op.alter_column('Products', 'image_path', new_column_name='img', type_=sa.String(length=100), existing_type=sa.String(length=255))
